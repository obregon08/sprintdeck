"use client";

import { useState } from "react";
import { TaskList } from "@/components/task-list";
import { TaskSwimlane } from "@/components/task-swimlane";
import { ViewToggle, type ViewMode } from "@/components/view-toggle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { TaskListProps } from "@/types";

export function ProjectTasksView({ projectId }: TaskListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <div className="flex items-center gap-4">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <Link href={`/protected/projects/${projectId}/tasks/create`}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </Link>
        </div>
      </div>

      {viewMode === "list" ? (
        <TaskList projectId={projectId} />
      ) : (
        <TaskSwimlane projectId={projectId} />
      )}
    </div>
  );
} 