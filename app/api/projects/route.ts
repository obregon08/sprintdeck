import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-server'

// GET /api/projects - List all projects for the authenticated user
export async function GET() {
  try {
    const session = await getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const projects = await db.project.findMany({
      where: {
        OR: [
          { userId: session.user.id }, // Projects owned by user
          { members: { some: { userId: session.user.id } } }, // Projects where user is a member
        ],
      },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    const project = await db.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        userId: session.user.id
      },
      include: {
        tasks: true
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 