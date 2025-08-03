"use client";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import Link from "next/link";
import { useTasks, useDeleteTask, useUpdateTaskStatus } from "@/hooks";
import type { TaskListProps, TaskWithDetails, TaskStatus } from "@/types";
import { TaskFilter } from "@/components/task-filter";
import { useTaskFilter } from "@/contexts/task-filter-context";
import { filterAndSortTasks } from "@/lib/utils/filter-utils";

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "LOW":
      return "bg-gray-100 text-gray-800";
    case "MEDIUM":
      return "bg-blue-100 text-blue-800";
    case "HIGH":
      return "bg-orange-100 text-orange-800";
    case "URGENT":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusDisplayName = (status: TaskStatus) => {
  switch (status) {
    case "TODO":
      return "To Do";
    case "IN_PROGRESS":
      return "In Progress";
    case "REVIEW":
      return "Review";
    case "DONE":
      return "Done";
    default:
      return status;
  }
};

const TASK_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

// Draggable Task Card Component
const DraggableTaskCard = ({ 
  task, 
  projectId, 
  onDelete,
  isUpdating
}: { 
  task: TaskWithDetails; 
  projectId: string; 
  onDelete: (taskId: string) => void;
  isUpdating: boolean;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as unknown as React.RefObject<HTMLDivElement>}
      className={`mb-3 transition-all duration-200 ${
        isDragging ? "opacity-50" : ""
      } ${isUpdating ? "opacity-75" : ""}`}
    >
      <Card className={`hover:shadow-md transition-shadow cursor-move ${
        isUpdating ? "ring-2 ring-blue-200" : ""
      }`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg">{task.title}</CardTitle>
              <CardDescription className="mt-2">
                {task.description || "No description"}
              </CardDescription>
            </div>
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
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Created {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex gap-2 mt-3">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Droppable Swimlane Component
const Swimlane = ({ 
  status, 
  tasks, 
  projectId, 
  onDrop, 
  onDelete,
  isUpdating
}: { 
  status: TaskStatus; 
  tasks: TaskWithDetails[]; 
  projectId: string; 
  onDrop: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  isUpdating: boolean;
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: string; status: TaskStatus }) => {
      if (item.status !== status) {
        onDrop(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      className={`flex-1 min-h-[400px] p-4 rounded-lg border-2 border-dashed transition-colors ${
        isOver ? "border-blue-400 bg-blue-50" : "border-gray-200"
      }`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{getStatusDisplayName(status)}</h3>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            projectId={projectId}
            onDelete={onDelete}
            isUpdating={isUpdating}
          />
        ))}
      </div>
    </div>
  );
};

function SwimlaneSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {TASK_STATUSES.map((status) => (
        <div key={status} className="flex-1 min-h-[400px] p-4 rounded-lg border-2 border-dashed border-gray-200">
          <div className="mb-4">
            <div className="h-6 bg-muted rounded w-24 mb-2"></div>
            <div className="h-5 w-8 bg-muted rounded"></div>
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TaskSwimlane({ projectId }: TaskListProps) {
  const deleteTaskMutation = useDeleteTask();
  const updateTaskStatusMutation = useUpdateTaskStatus();
  const { state: filterState } = useTaskFilter();

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
        <TaskFilter />
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
      <TaskFilter />
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
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
} 