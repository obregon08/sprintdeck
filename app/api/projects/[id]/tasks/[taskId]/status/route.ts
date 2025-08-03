import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { TaskStatus } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const session = await getSession();
    const { id, taskId } = await params;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user has access to project (owner or member)
    const project = await db.project.findFirst({
      where: {
        id: id,
        OR: [
          { userId: session.user.id }, // Project owner
          { members: { some: { userId: session.user.id } } }, // Project member
        ],
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Verify the task belongs to the project
    const task = await db.task.findFirst({
      where: {
        id: taskId,
        projectId: id,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !Object.values(TaskStatus).includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: TODO, IN_PROGRESS, REVIEW, DONE" },
        { status: 400 }
      );
    }

    // Update the task status
    const updatedTask = await db.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: status as TaskStatus,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      projectId: updatedTask.projectId,
      assigneeId: updatedTask.assigneeId,
      createdAt: updatedTask.createdAt.toISOString(),
      updatedAt: updatedTask.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 