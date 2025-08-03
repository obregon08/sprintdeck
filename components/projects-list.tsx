"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProjects, useDeleteProject, useMyProjectRole } from "@/hooks";
import { ProjectsSkeleton } from "@/components/projects-skeleton";
import { ProjectFilter } from "@/components/project-filter";
import { useProjectFilter } from "@/contexts/project-filter-context";
import { filterAndSortProjects } from "@/lib/utils/filter-utils";
import { useSession } from "@/lib/auth-client";

export function ProjectsList() {
  const router = useRouter();
  const deleteProjectMutation = useDeleteProject();
  const { state: filterState } = useProjectFilter();
  const session = useSession();

  const {
    data: projects,
    isLoading,
    error,
    refetch,
  } = useProjects();

  if (isLoading) {
    return <ProjectsSkeleton />;
  }

  if (error) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardContent className="text-center py-12">
            <p className="text-destructive mb-4">Failed to load projects</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Apply filters and sorting
  const filteredProjects = projects ? filterAndSortProjects(projects, filterState, session?.user?.id) : [];

  if (!projects || projects.length === 0) {
    return (
      <div className="space-y-6">
        <ProjectFilter />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <Plus className="h-12 w-12 text-muted-foreground mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first project to get started with task management.
                </p>
                <Link href="/protected/projects/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Project
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectFilter />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link href={`/protected/projects/${project.id}`} className="block">
                    <CardTitle className="text-lg hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                  </Link>
                  <CardDescription className="mt-2">
                    {project.description || "No description"}
                  </CardDescription>
                </div>
                {project.userId === session?.user?.id && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push(`/protected/projects/${project.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
                          deleteProjectMutation.mutate(project.id);
                        }
                      }}
                      disabled={deleteProjectMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tasks</span>
                  <Badge variant="secondary">{project.tasks.length}</Badge>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {project.tasks.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Recent tasks:</p>
                    <div className="space-y-1">
                      {project.tasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center justify-between text-xs">
                          <span className="truncate flex-1">{task.title}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {task.status}
                          </Badge>
                        </div>
                      ))}
                      {project.tasks.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{project.tasks.length - 3} more tasks
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 