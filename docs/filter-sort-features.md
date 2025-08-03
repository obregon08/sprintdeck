# Filter and Sort Features

This document describes the filter and sort functionality implemented using Context + Reducer pattern for state management.

## Overview

The application now includes comprehensive filtering and sorting capabilities for both projects and tasks, implemented using React Context and useReducer for state management.

## Architecture

### State Management
- **Context + Reducer Pattern**: Used for managing filter and sort state
- **Project Filter Context**: Manages project filtering and sorting state
- **Task Filter Context**: Manages task filtering and sorting state
- **Utility Functions**: Pure functions for filtering and sorting logic

### File Structure
```
contexts/
├── project-filter-context.tsx
└── task-filter-context.tsx

lib/
├── reducers/
│   ├── project-filter-reducer.ts
│   └── task-filter-reducer.ts
└── utils/
    └── filter-utils.ts

components/
├── project-filter.tsx
└── task-filter.tsx

types/
└── filters.ts
```

## Project Filtering

### Available Filters
- **Search**: Filter by project name or description
- **Owner**: Filter by project owner (user ID)
- **Sort By**: Name, Created Date, Updated Date, Task Count
- **Sort Order**: Ascending or Descending

### Usage
```tsx
import { useProjectFilter } from '@/contexts/project-filter-context';

function MyComponent() {
  const { state, dispatch } = useProjectFilter();
  
  // Access filter state
  console.log(state.search, state.owner, state.sortBy);
  
  // Update filters
  dispatch({ type: 'SET_SEARCH', payload: 'my project' });
}
```

## Task Filtering

### Available Filters
- **Search**: Filter by task title or description
- **Status**: TODO, IN_PROGRESS, REVIEW, DONE, or ALL
- **Priority**: LOW, MEDIUM, HIGH, URGENT, or ALL
- **Assignee**: Filter by assignee ID or "unassigned"
- **Sort By**: Title, Created Date, Updated Date, Priority, Status
- **Sort Order**: Ascending or Descending

### Usage
```tsx
import { useTaskFilter } from '@/contexts/task-filter-context';

function MyComponent() {
  const { state, dispatch } = useTaskFilter();
  
  // Access filter state
  console.log(state.search, state.status, state.priority);
  
  // Update filters
  dispatch({ type: 'SET_STATUS', payload: 'TODO' });
}
```

## Filter Components

### ProjectFilter Component
- Search input with icon
- Owner dropdown
- Sort options with direction toggle
- Active filter display with remove buttons
- Clear all filters button

### TaskFilter Component
- Search input with icon
- Status dropdown
- Priority dropdown
- Assignee dropdown
- Sort options with direction toggle
- Active filter display with remove buttons
- Clear all filters button

## Utility Functions

### filterAndSortProjects
```tsx
import { filterAndSortProjects } from '@/lib/utils/filter-utils';

const filteredProjects = filterAndSortProjects(projects, filterState);
```

### filterAndSortTasks
```tsx
import { filterAndSortTasks } from '@/lib/utils/filter-utils';

const filteredTasks = filterAndSortTasks(tasks, filterState);
```

## State Management Pattern

### Reducer Pattern
Each filter context uses a reducer to manage state:

```tsx
// Action types
type ProjectFilterAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_OWNER'; payload: string | 'ALL' }
  | { type: 'SET_SORT_BY'; payload: 'name' | 'createdAt' | 'updatedAt' | 'taskCount' }
  | { type: 'SET_SORT_ORDER'; payload: 'asc' | 'desc' }
  | { type: 'RESET_FILTERS' };

// Reducer function
function projectFilterReducer(state: ProjectFilterState, action: ProjectFilterAction) {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    // ... other cases
  }
}
```

### Context Provider
```tsx
export function ProjectFilterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectFilterReducer, initialProjectFilterState);

  return (
    <ProjectFilterContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectFilterContext.Provider>
  );
}
```

## Integration

### Layout Integration
The filter providers are added to the protected layout:

```tsx
// app/protected/layout.tsx
<QueryProvider>
  <ProjectFilterProvider>
    <TaskFilterProvider>
      {/* App content */}
    </TaskFilterProvider>
  </ProjectFilterProvider>
</QueryProvider>
```

### Component Integration
Components use the filter context and apply filtering:

```tsx
// components/projects-list.tsx
export function ProjectsList() {
  const { state: filterState } = useProjectFilter();
  const { data: projects } = useProjects();
  
  const filteredProjects = projects ? filterAndSortProjects(projects, filterState) : [];
  
  return (
    <div className="space-y-6">
      <ProjectFilter />
      {/* Render filtered projects */}
    </div>
  );
}
```

## Benefits of This Approach

1. **Separation of Concerns**: Filter logic is separated from UI components
2. **Reusability**: Filter utilities can be used across different components
3. **Testability**: Pure functions are easy to test
4. **Performance**: Efficient filtering and sorting with minimal re-renders
5. **Maintainability**: Clear state management pattern
6. **Scalability**: Easy to add new filter options

## Testing

Comprehensive tests are included for the filter utilities:

```bash
npm test lib/utils/__tests__/filter-utils.test.ts
```

Tests cover:
- Filtering by search terms
- Filtering by specific values (status, priority, etc.)
- Sorting in ascending and descending order
- Edge cases and empty states 