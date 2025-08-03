import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id: projectId } = await params;

    // Check if user has access to this project
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id }, // Project owner
          { members: { some: { userId: session.user.id } } }, // Project member
        ],
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get project members
    const members = await db.projectMember.findMany({
      where: { projectId },
    });

    // For now, we'll return the member data with userId
    // In a real app with Supabase auth, you'd join with the auth.users table
    const projectMembers = members.map((member: { userId: string; role: string }) => ({
      id: member.userId,
      email: `user-${member.userId}@example.com`, // Placeholder - in real app, get from auth.users
      name: `User ${member.userId.slice(0, 8)}`, // Placeholder - in real app, get from auth.users
      role: member.role,
    }));

    return NextResponse.json(projectMembers);
  } catch (error) {
    console.error("Error fetching project members:", error);
    return NextResponse.json(
      { error: "Failed to fetch project members" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id: projectId } = await params;
    const { userId, role = "MEMBER" } = await request.json();

    // Check if user is project owner or admin
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id }, // Project owner
          { members: { some: { userId: session.user.id, role: { in: ["OWNER", "ADMIN"] } } } }, // Admin
        ],
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if user is already a member
    const existingMember = await db.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json({ error: "User is already a member" }, { status: 400 });
    }

    // Add user to project
    await db.projectMember.create({
      data: {
        projectId,
        userId,
        role,
      },
    });

    return NextResponse.json({ message: "User added to project successfully" });
  } catch (error) {
    console.error("Error adding project member:", error);
    return NextResponse.json(
      { error: "Failed to add project member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id: projectId } = await params;
    const { userId } = await request.json();

    // Check if user is project owner or admin
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id }, // Project owner
          { members: { some: { userId: session.user.id, role: { in: ["OWNER", "ADMIN"] } } } }, // Admin
        ],
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Prevent removing the project owner
    if (project.userId === userId) {
      return NextResponse.json({ error: "Cannot remove project owner" }, { status: 400 });
    }

    // Check if user is a member
    const existingMember = await db.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!existingMember) {
      return NextResponse.json({ error: "User is not a member of this project" }, { status: 404 });
    }

    // Remove user from project
    await db.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    return NextResponse.json({ message: "User removed from project successfully" });
  } catch (error) {
    console.error("Error removing project member:", error);
    return NextResponse.json(
      { error: "Failed to remove project member" },
      { status: 500 }
    );
  }
} 