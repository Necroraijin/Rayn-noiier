import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession()
    const tenantId = (session?.user as any)?.tenantId || "rayn"

    let tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        users: true,
        cases: true,
      }
    })

    if (!tenant) {
      // Auto-create default tenant configuration to ensure a smooth, out-of-the-box user experience
      tenant = await prisma.tenant.create({
        data: {
          id: tenantId,
          name: tenantId === "rayn" ? "Rayn & Partners LLP" : `${tenantId.toUpperCase()} Legal`,
          domain: `${tenantId}.law`,
          region: "us-east-1",
          logo: tenantId.substring(0, 1).toUpperCase(),
          plan: "enterprise",
          seatsTotal: 15,
          seatsUsed: 1,
          aiContextLimit: 200000,
          aiMonthlyBudget: 50000000,
          aiTokensUsed: 28400000, // mock base token usage
          kmsKeyId: "arn:aws:kms:us-east-1:****:key/mrk-rayn-prod-2026",
          cognitoPoolId: "us-east-1_RaynProd",
          rdsSchemaName: `tenant_${tenantId}`,
          s3Bucket: `${tenantId}-legal-docs-prod`,
        },
        include: {
          users: true,
          cases: true,
        }
      })
    }

    return NextResponse.json({
      tenant,
      users: tenant.users || [],
      cases: tenant.cases || [],
    })
  } catch (error: any) {
    console.error("Error in GET /api/tenant:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    const tenantId = (session?.user as any)?.tenantId || "rayn"

    const body = await req.json()
    const { action, plan, seatsTotal, seatsUsed } = body

    if (action === "updatePlan" && plan) {
      const limits: Record<string, { ctx: number; budget: number }> = {
        professional: { ctx: 100000, budget: 20000000 },
        enterprise: { ctx: 200000, budget: 50000000 },
        unlimited: { ctx: 500000, budget: 200000000 },
      }

      const updated = await prisma.tenant.update({
        where: { id: tenantId },
        data: {
          plan,
          aiContextLimit: limits[plan].ctx,
          aiMonthlyBudget: limits[plan].budget,
        }
      })
      return NextResponse.json({ success: true, tenant: updated })
    }

    if (action === "updateSeats" && typeof seatsTotal === "number") {
      const updated = await prisma.tenant.update({
        where: { id: tenantId },
        data: {
          seatsTotal,
          ...(typeof seatsUsed === "number" ? { seatsUsed } : {})
        }
      })
      return NextResponse.json({ success: true, tenant: updated })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Error in POST /api/tenant:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
