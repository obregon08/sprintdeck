"use client";

import { useDrag } from "react-dnd";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, User } from "lucide-react";
import Link from "next/link";
import type { DraggableTaskCardProps } from "@/types";
import { getPriorityColor, getAssigneeName } from "@/lib/utils/task-utils";

export function DraggableTaskCard({ 
  task, 
  projectId, 
  onDelete,
  isUpdating,
  userRole,
  assignees
}: DraggableTaskCardProps) {
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
                  onClick={() => onDelete(task.id)}
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
    </div>
  );
} 