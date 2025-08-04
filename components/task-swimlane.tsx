"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useTasks, useDeleteTask, useUpdateTaskStatus, useMyProjectRole, useProjectAssignees } from "@/hooks";
import type { TaskListProps, TaskStatus, TaskWithDetails } from "@/types";
import { TaskFilter } from "@/components/task-filter";
import { useTaskFilter } from "@/contexts/task-filter-context";
import { filterAndSortTasks } from "@/lib/utils/filter-utils";
import { Swimlane } from "./swimlane";
import { SwimlaneSkeleton } from "./swimlane-skeleton";

const TASK_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

export function TaskSwimlane({ projectId }: TaskListProps) {
  const deleteTaskMutation = useDeleteTask();
  const updateTaskStatusMutation = useUpdateTaskStatus();
  const { state: filterState } = useTaskFilter();
  const { data: userRole } = useMyProjectRole(projectId);
  const { data: assignees } = useProjectAssignees(projectId);

  const {
    data: tasks,
    isLoading,
    error,
    refetch,
  } = useTasks(projectId);

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      deleteTaskMutation.mutate({ projectId, taskId });
    }
  };

  const handleDropTask = (taskId: string, newStatus: TaskStatus) => {
    // Find the current task to get its current status
    const currentTask = tasks?.find(task => task.id === taskId);
    if (!currentTask || currentTask.status === newStatus) {
      return; // No change needed
    }

    updateTaskStatusMutation.mutate({ projectId, taskId, status: newStatus });
  };

  if (isLoading) {
    return <SwimlaneSkeleton />;
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

  // Group tasks by status
  const tasksByStatus = filteredTasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, TaskWithDetails[]>);

  return (
    <div className="space-y-4">
      <TaskFilter projectId={projectId} />
      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TASK_STATUSES.map((status) => (
            <Swimlane
              key={status}
              status={status}
              tasks={tasksByStatus[status] || []}
              projectId={projectId}
              onDrop={handleDropTask}
              onDelete={handleDeleteTask}
              isUpdating={updateTaskStatusMutation.isPending}
              userRole={userRole}
              assignees={assignees}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
} 