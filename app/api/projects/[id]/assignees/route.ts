import { NextRequest, NextResponse } from "next/server";
import { getSession, createAdminClient } from "@/lib/auth-server";
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

    // Create admin client to fetch user data
    const supabase = await createAdminClient();
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 }
      );
    }

    // Create a map of user IDs to user data
    const userMap = new Map();
    users.users.forEach(user => {
      userMap.set(user.id, {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name || user.email || "",
      });
    });

    // Create assignees list including project owner and members
    const assignees = [];

    // Add project owner
    const ownerUser = userMap.get(project.userId);
    if (ownerUser) {
      assignees.push({
        id: project.userId,
        email: ownerUser.email,
        name: ownerUser.name,
      });
    }

    // Add project members
    members.forEach((member: { userId: string }) => {
      const memberUser = userMap.get(member.userId);
      if (memberUser) {
        assignees.push({
          id: member.userId,
          email: memberUser.email,
          name: memberUser.name,
        });
      }
    });

    // Add current user if not already included
    const currentUserIncluded = assignees.some(assignee => assignee.id === session.user.id);
    if (!currentUserIncluded) {
      const currentUser = userMap.get(session.user.id);
      if (currentUser) {
        assignees.push({
          id: session.user.id,
          email: currentUser.email,
          name: currentUser.name,
        });
      }
    }

    return NextResponse.json(assignees);
  } catch (error) {
    console.error("Error fetching project assignees:", error);
    return NextResponse.json(
      { error: "Failed to fetch project assignees" },
      { status: 500 }
    );
  }
} 