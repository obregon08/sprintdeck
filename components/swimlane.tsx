"use client";

import { useDrop } from "react-dnd";
import { Badge } from "@/components/ui/badge";
import type { TaskWithDetails, TaskStatus, Assignee } from "@/types";
import { getStatusDisplayName } from "@/lib/utils/task-utils";
import { DraggableTaskCard } from "./draggable-task-card";

interface SwimlaneProps {
  status: TaskStatus;
  tasks: TaskWithDetails[];
  projectId: string;
  onDrop: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  isUpdating: boolean;
  userRole?: { role: string };
  assignees?: Assignee[];
}

export function Swimlane({ 
  status, 
  tasks, 
  projectId, 
  onDrop, 
  onDelete,
  isUpdating,
  userRole,
  assignees
}: SwimlaneProps) {
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
            userRole={userRole}
            assignees={assignees}
          />
        ))}
      </div>
    </div>
  );
} 