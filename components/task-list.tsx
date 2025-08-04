"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar, User } from "lucide-react";
import Link from "next/link";
import { useTasks, useDeleteTask, useMyProjectRole, useProjectAssignees } from "@/hooks";
import type { TaskListProps } from "@/types";
import { TaskFilter } from "@/components/task-filter";
import { TasksSkeleton } from "@/components/tasks-skeleton";
import { useTaskFilter } from "@/contexts/task-filter-context";
import { filterAndSortTasks } from "@/lib/utils/filter-utils";
import { getStatusColor, getPriorityColor, getAssigneeName } from "@/lib/utils/task-utils";





export function TaskList({ projectId }: TaskListProps) {
  const deleteTaskMutation = useDeleteTask();
  const { state: filterState } = useTaskFilter();
  const { data: userRole } = useMyProjectRole(projectId);
  const { data: assignees } = useProjectAssignees(projectId);

  const {
    data: tasks,
    isLoading,
    error,
    refetch,
  } = useTasks(projectId);



  if (isLoading) {
    return <TasksSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-destructive mb-4">Failed to load tasks</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Apply filters and sorting
  const filteredTasks = tasks ? filterAndSortTasks(tasks, filterState) : [];

  if (!tasks || tasks.length === 0) {
    return (
      <div className="space-y-4">
        <TaskFilter projectId={projectId} />
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No tasks found</p>
            <Link href={`/protected/projects/${projectId}/tasks/create`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create First Task
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TaskFilter projectId={projectId} />
      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {task.description}
                  </CardDescription>
                </div>
                {userRole?.role && (
                  <div className="flex gap-2 ml-4">
                    <Link href={`/protected/projects/${projectId}/tasks/${task.id}/edit`}>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
                          deleteTaskMutation.mutate({ projectId, taskId: task.id });
                        }
                      }}
                      disabled={deleteTaskMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Created {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex gap-2">
                  <Badge className={getStatusColor(task.status)}>
                    {task.status.replace("_", " ")}
                  </Badge>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                {task.assigneeId && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">
                      {getAssigneeName(task.assigneeId, assignees)}
                    </span>
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