import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand } from "@aws-sdk/client-cognito-identity-provider"

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = (session.user as any).tenantId || "rayn"
    const role = (session.user as any).role

    if (role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      where: { tenantId },
      orderBy: { name: "asc" }
    })

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error("Error in GET /api/users:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

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
    const { name, email, role, password } = body

    if (!name || !email || !role || !password) {
      return NextResponse.json({ error: "Missing required fields: name, email, role, password" }, { status: 400 })
    }

    // 1. Verify user limit / seats
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    })

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    if (tenant.seatsUsed >= tenant.seatsTotal) {
      return NextResponse.json({ error: "Seat limit reached. Upgrade your subscription to add more users." }, { status: 400 })
    }

    // 2. Check if user already exists in database
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email is already registered." }, { status: 409 })
    }

    // 3. Create user in Cognito User Pool
    const issuer = process.env.COGNITO_ISSUER
    const userPoolId = issuer ? issuer.split("/").pop() : undefined

    if (!userPoolId) {
      return NextResponse.json({ error: "AWS Cognito User Pool is not configured in environment" }, { status: 500 })
    }

    console.log(`Creating user ${email} in Cognito pool ${userPoolId}...`)
    
    // Create user in Cognito
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "email_verified", Value: "true" },
        { Name: "name", Value: name },
        { Name: "custom:role", Value: role },
        { Name: "custom:tenantId", Value: tenantId }
      ],
      MessageAction: "SUPPRESS"
    })

    await cognitoClient.send(createUserCommand)

    // Set user's password permanent
    const setPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: email,
      Password: password,
      Permanent: true
    })

    await cognitoClient.send(setPasswordCommand)
    console.log(`Cognito user created and password set for ${email}`)

    // 4. Save to Database
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          role,
          status: "Active",
          lastActive: "Never",
          mfaEnabled: false,
          tenantId,
        }
      })

      await tx.tenant.update({
        where: { id: tenantId },
        data: { seatsUsed: { increment: 1 } }
      })

      await tx.auditLog.create({
        data: {
          tenantId,
          category: "SECURITY",
          event: "USER_CREATED",
          actor: session?.user?.email || "System",
          ip: "127.0.0.1",
          severity: "INFO",
          details: `Super Admin created user ${email} with role ${role}.`,
        }
      })

      return newUser
    })

    return NextResponse.json({ success: true, user: result })
  } catch (error: any) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
