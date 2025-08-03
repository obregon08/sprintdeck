import type { TaskStatus, Priority } from "@prisma/client";

// Project Filter Types
export interface ProjectFilterState {
  search: string;
  owner: string | 'ALL';
  sortBy: 'name' | 'createdAt' | 'updatedAt' | 'taskCount';
  sortOrder: 'asc' | 'desc';
}

export type ProjectFilterAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_OWNER'; payload: string | 'ALL' }
  | { type: 'SET_SORT_BY'; payload: 'name' | 'createdAt' | 'updatedAt' | 'taskCount' }
  | { type: 'SET_SORT_ORDER'; payload: 'asc' | 'desc' }
  | { type: 'RESET_FILTERS' };

// Task Filter Types
export interface TaskFilterState {
  search: string;
  status: TaskStatus | 'ALL';
  priority: Priority | 'ALL';
  assignee: string | 'ALL';
  sortBy: 'title' | 'createdAt' | 'updatedAt' | 'priority' | 'status';
  sortOrder: 'asc' | 'desc';
}

export type TaskFilterAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_STATUS'; payload: TaskStatus | 'ALL' }
  | { type: 'SET_PRIORITY'; payload: Priority | 'ALL' }
  | { type: 'SET_ASSIGNEE'; payload: string | 'ALL' }
  | { type: 'SET_SORT_BY'; payload: 'title' | 'createdAt' | 'updatedAt' | 'priority' | 'status' }
  | { type: 'SET_SORT_ORDER'; payload: 'asc' | 'desc' }
  | { type: 'RESET_FILTERS' }; 