import type { TaskFilterState, TaskFilterAction } from "@/types";

export const initialTaskFilterState: TaskFilterState = {
  search: "",
  status: "ALL",
  priority: "ALL",
  assignee: "ALL",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export function taskFilterReducer(
  state: TaskFilterState,
  action: TaskFilterAction
): TaskFilterState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    
    case "SET_STATUS":
      return { ...state, status: action.payload };
    
    case "SET_PRIORITY":
      return { ...state, priority: action.payload };
    
    case "SET_ASSIGNEE":
      return { ...state, assignee: action.payload };
    
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };
    
    case "SET_SORT_ORDER":
      return { ...state, sortOrder: action.payload };
    
    case "RESET_FILTERS":
      return initialTaskFilterState;
    
    default:
      return state;
  }
} 