import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-server'

// GET /api/projects/[id]/tasks/[taskId] - Get a specific task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const session = await getSession()
    const { id, taskId } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user has access to project (owner or member)
    const project = await db.project.findFirst({
      where: {
        id: id,
        OR: [
          { userId: session.user.id }, // Project owner
          { members: { some: { userId: session.user.id } } }, // Project member
        ],
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const task = await db.task.findFirst({
      where: {
        id: taskId,
        projectId: id
      }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id]/tasks/[taskId] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const session = await getSession()
    const { id, taskId } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user has access to project (owner or member)
    const project = await db.project.findFirst({
      where: {
        id: id,
        OR: [
          { userId: session.user.id }, // Project owner
          { members: { some: { userId: session.user.id } } }, // Project member
        ],
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if task exists and belongs to project
    const existingTask = await db.task.findFirst({
      where: {
        id: taskId,
        projectId: id
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { title, description, status, priority, assigneeId } = body

    // Validate input
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      )
    }

    const updatedTask = await db.task.update({
      where: {
        id: taskId
      },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || existingTask.status,
        priority: priority || existingTask.priority,
        assigneeId: assigneeId || null
      }
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id]/tasks/[taskId] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const session = await getSession()
    const { id, taskId } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user has access to project (owner or member)
    const project = await db.project.findFirst({
      where: {
        id: id,
        OR: [
          { userId: session.user.id }, // Project owner
          { members: { some: { userId: session.user.id } } }, // Project member
        ],
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if task exists and belongs to project
    const existingTask = await db.task.findFirst({
      where: {
        id: taskId,
        projectId: id
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Delete the task
    await db.task.delete({
      where: {
        id: taskId
      }
    })

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 