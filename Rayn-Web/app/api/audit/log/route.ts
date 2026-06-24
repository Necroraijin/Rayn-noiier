import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { dynamoClient } from "@/lib/aws"
import { PutItemCommand } from "@aws-sdk/client-dynamodb"

export async function GET() {
  try {
    const session = await getServerSession()
    const tenantId = (session?.user as any)?.tenantId || "rayn"

    const logs = await prisma.auditLog.findMany({
      where: { tenantId },
      orderBy: { timestamp: "desc" },
      take: 50,
    })

    return NextResponse.json({
      success: true,
      logs: logs.map(l => ({
        id: l.id,
        timestamp: l.timestamp.toISOString(),
        tenantId: l.tenantId,
        category: l.category,
        event: l.event,
        actor: l.actor,
        ip: l.ip,
        severity: l.severity,
        details: l.details,
      })),
    })
  } catch (error: any) {
    console.error("Error in GET /api/audit/log:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    const defaultTenantId = (session?.user as any)?.tenantId || "rayn"

    const body = await req.json()
    const { category, event, actor, ip, severity, details, tenantId } = body

    const activeTenantId = tenantId || defaultTenantId

    if (!category || !event || !actor || !ip || !severity) {
      return NextResponse.json({ error: "Missing required audit fields" }, { status: 400 })
    }

    const timestamp = new Date().toISOString()
    const logId = `EVT-${Math.floor(100000 + Math.random() * 900000)}`

    // 1. Attempt to write to DynamoDB
    const hasAwsCreds = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
    let dynamodbSaved = false

    if (hasAwsCreds) {
      try {
        const tableName = `rayn-audit-${activeTenantId}`
        
        const command = new PutItemCommand({
          TableName: tableName,
          Item: {
            id: { S: logId },
            timestamp: { S: timestamp },
            tenantId: { S: activeTenantId },
            category: { S: category },
            event: { S: event },
            actor: { S: actor },
            ip: { S: ip },
            severity: { S: severity },
            details: { S: details || "" },
          }
        })

        await dynamoClient.send(command)
        dynamodbSaved = true
      } catch (dynamoError: any) {
        console.warn("DynamoDB write failed, falling back to local database only:", dynamoError.message)
      }
    }

    // 2. Write to PostgreSQL using Prisma (to power the local dashboard view)
    let postgresSaved = false
    try {
      // Ensure tenant exists before adding audit log
      const tenantExists = await prisma.tenant.findUnique({
        where: { id: activeTenantId }
      })

      if (tenantExists) {
        await prisma.auditLog.create({
          data: {
            id: logId,
            tenantId: activeTenantId,
            category,
            event,
            actor,
            ip,
            severity,
            details: details || "",
            timestamp: new Date(timestamp),
          }
        })
        postgresSaved = true
      }
    } catch (dbError: any) {
      console.error("Prisma audit log creation failed:", dbError.message)
    }

    return NextResponse.json({
      success: true,
      logId,
      dynamodbSaved,
      postgresSaved,
    })
  } catch (error: any) {
    console.error("Audit logging route error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
