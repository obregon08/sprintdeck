import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-server'
import { TaskStatus, Priority } from '@prisma/client'

// GET /api/projects/[id]/tasks - List all tasks for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const { id } = await params
    
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

    const tasks = await db.task.findMany({
      where: {
        projectId: id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/tasks - Create a new task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const { id } = await params
    
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

    const body = await request.json()
    const { title, description, status = TaskStatus.TODO, priority = Priority.MEDIUM, assigneeId } = body

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      )
    }

    const task = await db.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status,
        priority,
        projectId: id,
        assigneeId: assigneeId || null
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 