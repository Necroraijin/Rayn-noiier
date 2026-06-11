import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      companyName,
      companyEmail,
      companyWebsite,
      gstNumber,
      panNumber,
      businessType,
      signatoryName,
      contactNumber,
      address,
      state,
      pincode,
      plan,
    } = body

    if (!companyName || !companyEmail || !gstNumber || !panNumber || !signatoryName || !contactNumber) {
      return NextResponse.json({ error: "Missing required corporate registration details" }, { status: 400 })
    }

    // Generate tenant ID slug from company name
    const tenantId = companyName.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 12)

    // Check if tenant already exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    })
    if (existingTenant) {
      return NextResponse.json({ error: "A workspace with this company name already exists." }, { status: 409 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: companyEmail }
    })
    if (existingUser) {
      return NextResponse.json({ error: "A user with this company email is already registered." }, { status: 409 })
    }

    // Configure limits based on plan
    const selectedPlan = plan || "enterprise"
    const planLimits: Record<string, { ctx: number; budget: number; seats: number }> = {
      professional: { ctx: 100000, budget: 20000000, seats: 10 },
      enterprise: { ctx: 200000, budget: 50000000, seats: 25 },
      unlimited: { ctx: 500000, budget: 200000000, seats: 99 },
    }
    const limits = planLimits[selectedPlan] || planLimits.enterprise

    // Extract domain from email
    const emailDomain = companyEmail.split("@")[1] || "workspace.law"

    // ── TRANSACTION PROVISIONING ────────────────────────────────────────
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Tenant
      const tenant = await tx.tenant.create({
        data: {
          id: tenantId,
          name: companyName,
          domain: companyWebsite ? companyWebsite.replace(/https?:\/\/(www\.)?/, "") : emailDomain,
          region: "us-east-1",
          logo: companyName.substring(0, 1).toUpperCase(),
          plan: selectedPlan,
          seatsTotal: limits.seats,
          seatsUsed: 1,
          aiContextLimit: limits.ctx,
          aiMonthlyBudget: limits.budget,
          aiTokensUsed: 0,
          kmsKeyId: `arn:aws:kms:us-east-1:xxxx:key/mrk-${tenantId}-prod`,
          cognitoPoolId: `us-east-1_${tenantId}Prod`,
          rdsSchemaName: `tenant_${tenantId}`,
          s3Bucket: `${tenantId}-legal-docs-prod`,
        }
      })

      // 2. Create User
      const user = await tx.user.create({
        data: {
          name: signatoryName,
          email: companyEmail,
          role: "SUPER_ADMIN",
          status: "Active",
          lastActive: "Just now",
          mfaEnabled: true,
          tenantId: tenantId,
        }
      })

      // 3. Create initial audit log
      await tx.auditLog.create({
        data: {
          tenantId,
          category: "SYSTEM",
          event: "WORKSPACE_PROVISIONED",
          actor: signatoryName,
          ip: "127.0.0.1",
          severity: "WARNING",
          details: `Provisioned B2B SaaS tenant for ${companyName} on plan ${selectedPlan}. GSTIN: ${gstNumber}, PAN: ${panNumber}, Rep: ${signatoryName}.`,
        }
      })

      return { tenant, user }
    })

    return NextResponse.json({
      success: true,
      tenantId: result.tenant.id,
      email: result.user.email,
      role: result.user.role,
    })
  } catch (error: any) {
    console.error("Workspace registration error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
