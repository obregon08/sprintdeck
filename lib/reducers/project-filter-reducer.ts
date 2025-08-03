import type { ProjectFilterState, ProjectFilterAction } from "@/types";

export const initialProjectFilterState: ProjectFilterState = {
  search: "",
  owner: "ALL",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export function projectFilterReducer(
  state: ProjectFilterState,
  action: ProjectFilterAction
): ProjectFilterState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    
    case "SET_OWNER":
      return { ...state, owner: action.payload };
    
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };
    
    case "SET_SORT_ORDER":
      return { ...state, sortOrder: action.payload };
    
    case "RESET_FILTERS":
      return initialProjectFilterState;
    
    default:
      return state;
  }
} 