"use client";

import { Button } from "@/components/ui/button";
import { List, LayoutGrid } from "lucide-react";

export type ViewMode = "list" | "swimlane";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      <Button
        size="sm"
        variant={viewMode === "list" ? "default" : "ghost"}
        onClick={() => onViewModeChange("list")}
        className="h-8 px-3"
      >
        <List className="h-4 w-4 mr-2" />
        List
      </Button>
      <Button
        size="sm"
        variant={viewMode === "swimlane" ? "default" : "ghost"}
        onClick={() => onViewModeChange("swimlane")}
        className="h-8 px-3"
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Swimlane
      </Button>
    </div>
  );
} 