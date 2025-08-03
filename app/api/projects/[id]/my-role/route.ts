import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-server'

// GET /api/projects/[id]/my-role - Get current user's role in the project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: projectId } = await params

    // Check if user is project owner
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      }
    })

    if (project) {
      return NextResponse.json({ role: 'OWNER' })
    }

    // Check if user is a project member
    const member = await db.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: session.user.id
        }
      }
    })

    if (member) {
      return NextResponse.json({ role: member.role })
    }

    // User has no access to this project
    return NextResponse.json(
      { error: 'Access denied' },
      { status: 403 }
    )
  } catch (error) {
    console.error('Error fetching user role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 