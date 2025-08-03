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

    // Get project members (these are the potential assignees)
    const members = await db.projectMember.findMany({
      where: { projectId },
    });

    // For demo purposes, return mock user data with project member roles
    // In a real app, you'd join with a users table or Supabase auth
    const mockUsers = [
      { id: "user-1", email: "alice@example.com", name: "Alice Johnson" },
      { id: "user-2", email: "bob@example.com", name: "Bob Smith" },
      { id: "user-3", email: "carol@example.com", name: "Carol Davis" },
      { id: "user-4", email: "dave@example.com", name: "Dave Wilson" },
    ];

    // Filter to only show users who are project members
    const projectMemberIds = members.map(m => m.userId);
    const assignees = mockUsers.filter(user => projectMemberIds.includes(user.id));

    return NextResponse.json(assignees);
  } catch (error) {
    console.error("Error fetching project assignees:", error);
    return NextResponse.json(
      { error: "Failed to fetch project assignees" },
      { status: 500 }
    );
  }
} 