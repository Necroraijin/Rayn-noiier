import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { CognitoIdentityProviderClient, AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider"

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = (session.user as any).tenantId || "rayn"
    const actorRole = (session.user as any).role

    if (actorRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 })
    }

    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Missing required field: email" }, { status: 400 })
    }

    // 1. Find user in Database
    const user = await prisma.user.findFirst({
      where: { email, tenantId }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found in this workspace" }, { status: 404 })
    }

    // Protect from deleting self
    if (user.email === session.user.email) {
      return NextResponse.json({ error: "Forbidden: You cannot delete your own account" }, { status: 400 })
    }

    // 2. Delete user from Cognito User Pool
    const issuer = process.env.COGNITO_ISSUER
    const userPoolId = issuer ? issuer.split("/").pop() : undefined

    if (userPoolId) {
      try {
        console.log(`Deleting user ${email} from Cognito pool ${userPoolId}...`)
        const deleteCommand = new AdminDeleteUserCommand({
          UserPoolId: userPoolId,
          Username: email,
        })
        await cognitoClient.send(deleteCommand)
        console.log(`Successfully deleted Cognito login for ${email}`)
      } catch (cognitoError: any) {
        console.warn(`Cognito deletion warning for ${email}:`, cognitoError.message)
        // Continue even if user is missing in Cognito (e.g. if deleted manually)
      }
    }

    // 3. Delete from Database and update seats count in transaction
    await prisma.$transaction(async (tx) => {
      await tx.user.delete({
        where: { email }
      })

      await tx.tenant.update({
        where: { id: tenantId },
        data: { seatsUsed: { decrement: 1 } }
      })

      await tx.auditLog.create({
        data: {
          tenantId,
          category: "SECURITY",
          event: "USER_DELETED",
          actor: session?.user?.email || "System",
          ip: "127.0.0.1",
          severity: "WARNING",
          details: `Super Admin deleted user ${email} with role ${user.role}.`,
        }
      })
    })

    return NextResponse.json({ success: true, message: `Successfully deleted user ${email}` })
  } catch (error: any) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
