"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { projectFilterReducer, initialProjectFilterState } from "@/lib/reducers/project-filter-reducer";
import type { ProjectFilterState, ProjectFilterAction } from "@/types";

interface ProjectFilterContextType {
  state: ProjectFilterState;
  dispatch: React.Dispatch<ProjectFilterAction>;
}

const ProjectFilterContext = createContext<ProjectFilterContextType | undefined>(undefined);

export function ProjectFilterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectFilterReducer, initialProjectFilterState);

  return (
    <ProjectFilterContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectFilterContext.Provider>
  );
}

export function useProjectFilter() {
  const context = useContext(ProjectFilterContext);
  if (context === undefined) {
    throw new Error("useProjectFilter must be used within a ProjectFilterProvider");
  }
  return context;
} 