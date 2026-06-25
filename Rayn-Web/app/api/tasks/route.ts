import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = (session.user as any).tenantId || "rayn"

    // Fetch tenant-isolated tasks
    const tasks = await prisma.task.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ tasks })
  } catch (error: any) {
    console.error("Error in GET /api/tasks:", error)
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
    const actorEmail = session.user.email || "System"

    const body = await req.json()
    const { title, matter, priority, dueDate } = body

    if (!title || !matter || !priority || !dueDate) {
      return NextResponse.json({ error: "Missing required fields: title, matter, priority, dueDate" }, { status: 400 })
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        matter,
        priority: priority.toUpperCase(),
        dueDate,
        completed: false,
        assignedBy: actorEmail.split("@")[0],
        tenantId
      }
    })

    // Log the audit event
    await prisma.auditLog.create({
      data: {
        tenantId,
        category: "SYSTEM",
        event: "TASK_CREATED",
        actor: actorEmail,
        ip: "127.0.0.1",
        severity: "INFO",
        details: `Task '${title}' created for matter '${matter}' by ${actorEmail}.`
      }
    })

    return NextResponse.json({ success: true, task: newTask })
  } catch (error: any) {
    console.error("Error in POST /api/tasks:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
