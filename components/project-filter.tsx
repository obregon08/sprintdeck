"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, ArrowUp, ArrowDown } from "lucide-react";
import { useProjectFilter } from "@/contexts/project-filter-context";

export function ProjectFilter() {
  const { state, dispatch } = useProjectFilter();

  const handleSearchChange = (value: string) => {
    dispatch({ type: "SET_SEARCH", payload: value });
  };

  const handleOwnerChange = (value: string) => {
    dispatch({ type: "SET_OWNER", payload: value as string | "ALL" });
  };

  const handleSortByChange = (value: string) => {
    dispatch({ 
      type: "SET_SORT_BY", 
      payload: value as "name" | "createdAt" | "updatedAt" | "taskCount" 
    });
  };

  const handleSortOrderChange = () => {
    const newOrder = state.sortOrder === "asc" ? "desc" : "asc";
    dispatch({ type: "SET_SORT_ORDER", payload: newOrder });
  };

  const handleReset = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  const hasActiveFilters = state.search || state.owner !== "ALL";

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filter & Sort Projects</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={state.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={state.owner} onValueChange={handleOwnerChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Owners</SelectItem>
            <SelectItem value="current">My Projects</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Select value={state.sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="updatedAt">Updated Date</SelectItem>
              <SelectItem value="taskCount">Task Count</SelectItem>
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
      </div>

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
          {state.owner !== "ALL" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              Owner: {state.owner === "current" ? "My Projects" : state.owner}
              <button
                onClick={() => dispatch({ type: "SET_OWNER", payload: "ALL" })}
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