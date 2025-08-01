import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import Link from "next/link";
import type { ProjectDetailPageProps } from "@/types";

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const session = await getSession();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  const project = await db.project.findFirst({
    where: {
      id: id,
      userId: session.user.id,
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
            <Link href={`/protected/projects/${project.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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

          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                {project.tasks.length === 0
                  ? "No tasks yet"
                  : `${project.tasks.length} task${project.tasks.length === 1 ? "" : "s"}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {project.tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No tasks have been created for this project yet.
                  </p>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {project.tasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{task.status}</Badge>
                        <Badge variant="outline">{task.priority}</Badge>
                      </div>
                    </div>
                  ))}
                  {project.tasks.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{project.tasks.length - 5} more tasks
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 