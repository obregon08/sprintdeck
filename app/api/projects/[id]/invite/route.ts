import { NextRequest, NextResponse } from "next/server";
import { getSession, findUserByEmail } from "@/lib/auth-server";
import { db } from "@/lib/db";

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
    const { email } = await request.json();

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

    // Look up the user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { 
          error: "User not found",
          message: "This user is not active in SprintDeck. The user should sign up first before you can add them. In a future version, we will send them an email."
        }, 
        { status: 404 }
      );
    }

    // Check if user is already a member
    const existingMember = await db.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.id,
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
        userId: user.id,
        role: "MEMBER",
      },
    });

    // In a real app, you'd send an email invitation here
    console.log(`Inviting ${email} to project ${projectId}`);

    return NextResponse.json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error("Error inviting user:", error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    );
  }
} 