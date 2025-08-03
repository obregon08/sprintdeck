import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import Link from "next/link";
import { ProjectTasksView } from "@/components/project-tasks-view";
import { InviteUserButton } from "@/components/invite-user-button";
import { ProjectMembersModal } from "@/components/project-members-modal";
import type { ProjectDetailPageProps } from "@/types";

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const session = await getSession();
  const { id } = await params;

  const project = await db.project.findFirst({
    where: {
      id: id,
      OR: [
        { userId: session!.user.id }, // Project owner
        { members: { some: { userId: session!.user.id } } }, // Project member
      ],
    },
    include: {
      tasks: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!project) {
    redirect("/protected/projects");
  }

  // Check if user is project owner (for edit permissions)
  const isOwner = project.userId === session!.user.id;

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link
          href="/protected/projects"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Link>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground mt-2">
              {project.description || "No description"}
            </p>
          </div>
          <div className="flex gap-2">
            {isOwner && (
              <Link href={`/protected/projects/${project.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
            )}
            {isOwner && <InviteUserButton projectId={project.id} />}
            <ProjectMembersModal projectId={project.id} />
            <Link href={`/protected/projects/${project.id}/tasks/create`}>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-sm">
                {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Tasks</span>
              <Badge variant="secondary">{project.tasks.length}</Badge>
            </div>
          </CardContent>
        </Card>
        
        <ProjectTasksView projectId={project.id} />
      </div>
    </div>
  );
} 