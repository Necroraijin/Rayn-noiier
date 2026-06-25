import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const tenantId = (session.user as any).tenantId || "rayn"

    // Check ownership
    const existing = await prisma.task.findFirst({
      where: { id, tenantId }
    })

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const body = await req.json()
    const { completed, title, priority, dueDate } = body

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(typeof completed === "boolean" ? { completed } : {}),
        ...(title ? { title } : {}),
        ...(priority ? { priority: priority.toUpperCase() } : {}),
        ...(dueDate ? { dueDate } : {})
      }
    })

    return NextResponse.json({ success: true, task: updated })
  } catch (error: any) {
    console.error("Error in PATCH /api/tasks/[id]:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const tenantId = (session.user as any).tenantId || "rayn"

    // Check ownership
    const existing = await prisma.task.findFirst({
      where: { id, tenantId }
    })

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    await prisma.task.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: "Task deleted successfully" })
  } catch (error: any) {
    console.error("Error in DELETE /api/tasks/[id]:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
