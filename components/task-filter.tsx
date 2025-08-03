"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, ArrowUp, ArrowDown } from "lucide-react";
import { useTaskFilter } from "@/contexts/task-filter-context";
import { useProjectAssignees } from "@/hooks/use-users";
import type { TaskStatus, Priority } from "@prisma/client";

const TASK_STATUS_OPTIONS: { value: TaskStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Statuses" },
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "REVIEW", label: "Review" },
  { value: "DONE", label: "Done" },
];

const PRIORITY_OPTIONS: { value: Priority | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Priorities" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "title", label: "Title" },
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
];

export function TaskFilter({ projectId }: { projectId: string }) {
  const { state, dispatch } = useTaskFilter();
  const { data: assignees = [] } = useProjectAssignees(projectId);

  const handleSearchChange = (value: string) => {
    dispatch({ type: "SET_SEARCH", payload: value });
  };

  const handleStatusChange = (value: string) => {
    dispatch({ type: "SET_STATUS", payload: value as TaskStatus | "ALL" });
  };

  const handlePriorityChange = (value: string) => {
    dispatch({ type: "SET_PRIORITY", payload: value as Priority | "ALL" });
  };

  const handleAssigneeChange = (value: string) => {
    dispatch({ type: "SET_ASSIGNEE", payload: value as string | "ALL" });
  };

  const handleSortByChange = (value: string) => {
    dispatch({ 
      type: "SET_SORT_BY", 
      payload: value as "title" | "createdAt" | "updatedAt" | "priority" | "status" 
    });
  };

  const handleSortOrderChange = () => {
    const newOrder = state.sortOrder === "asc" ? "desc" : "asc";
    dispatch({ type: "SET_SORT_ORDER", payload: newOrder });
  };

  const handleReset = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  const hasActiveFilters = 
    state.search || 
    state.status !== "ALL" || 
    state.priority !== "ALL" || 
    state.assignee !== "ALL";

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filter & Sort Tasks</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-6 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={state.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select value={state.status} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {TASK_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={state.priority} onValueChange={handlePriorityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Assignee Filter */}
        <Select value={state.assignee} onValueChange={handleAssigneeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Assignees</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {assignees.map((assignee) => (
              <SelectItem key={assignee.id} value={assignee.id}>
                {assignee.name || assignee.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2">
        <Select value={state.sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleSortOrderChange}
          className="h-10 w-10"
        >
          {state.sortOrder === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {state.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              Search: &quot;{state.search}&quot;
              <button
                onClick={() => dispatch({ type: "SET_SEARCH", payload: "" })}
                className="ml-1 hover:bg-primary/20 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {state.status !== "ALL" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              Status: {TASK_STATUS_OPTIONS.find(opt => opt.value === state.status)?.label}
              <button
                onClick={() => dispatch({ type: "SET_STATUS", payload: "ALL" })}
                className="ml-1 hover:bg-primary/20 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {state.priority !== "ALL" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              Priority: {PRIORITY_OPTIONS.find(opt => opt.value === state.priority)?.label}
              <button
                onClick={() => dispatch({ type: "SET_PRIORITY", payload: "ALL" })}
                className="ml-1 hover:bg-primary/20 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {state.assignee !== "ALL" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              Assignee: {
                state.assignee === "unassigned" 
                  ? "Unassigned" 
                  : assignees.find(a => a.id === state.assignee)?.name || 
                    assignees.find(a => a.id === state.assignee)?.email || 
                    state.assignee
              }
              <button
                onClick={() => dispatch({ type: "SET_ASSIGNEE", payload: "ALL" })}
                className="ml-1 hover:bg-primary/20 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
} 