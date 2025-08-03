"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { taskFilterReducer, initialTaskFilterState } from "@/lib/reducers/task-filter-reducer";
import type { TaskFilterState, TaskFilterAction } from "@/types";

interface TaskFilterContextType {
  state: TaskFilterState;
  dispatch: React.Dispatch<TaskFilterAction>;
}

const TaskFilterContext = createContext<TaskFilterContextType | undefined>(undefined);

export function TaskFilterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskFilterReducer, initialTaskFilterState);

  return (
    <TaskFilterContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskFilterContext.Provider>
  );
}

export function useTaskFilter() {
  const context = useContext(TaskFilterContext);
  if (context === undefined) {
    throw new Error("useTaskFilter must be used within a TaskFilterProvider");
  }
  return context;
} 