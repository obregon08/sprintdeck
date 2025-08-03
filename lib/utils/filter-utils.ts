import type { ProjectWithTasks, TaskWithDetails, ProjectFilterState, TaskFilterState } from "@/types";

  // Project filtering and sorting
  export function filterAndSortProjects(
    projects: ProjectWithTasks[],
    filters: ProjectFilterState
  ): ProjectWithTasks[] {
    const filtered = projects.filter((project) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        project.name.toLowerCase().includes(searchLower) ||
        (project.description?.toLowerCase().includes(searchLower) ?? false);
      if (!matchesSearch) return false;
    }

    // Owner filter
    if (filters.owner !== "ALL") {
      if (project.userId !== filters.owner) return false;
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (filters.sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "createdAt":
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case "updatedAt":
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      case "taskCount":
        aValue = a.tasks.length;
        bValue = b.tasks.length;
        break;
      default:
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
    }

    if (filters.sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return filtered;
}

  // Task filtering and sorting
  export function filterAndSortTasks(
    tasks: TaskWithDetails[],
    filters: TaskFilterState
  ): TaskWithDetails[] {
    const filtered = tasks.filter((task) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(searchLower) ||
        (task.description?.toLowerCase().includes(searchLower) ?? false);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status !== "ALL") {
      if (task.status !== filters.status) return false;
    }

    // Priority filter
    if (filters.priority !== "ALL") {
      if (task.priority !== filters.priority) return false;
    }

    // Assignee filter
    if (filters.assignee !== "ALL") {
      if (task.assigneeId !== filters.assignee) return false;
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (filters.sortBy) {
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "createdAt":
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case "updatedAt":
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      case "priority":
        // Priority order: URGENT > HIGH > MEDIUM > LOW
        const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        break;
      case "status":
        // Status order: TODO > IN_PROGRESS > REVIEW > DONE
        const statusOrder = { TODO: 1, IN_PROGRESS: 2, REVIEW: 3, DONE: 4 };
        aValue = statusOrder[a.status as keyof typeof statusOrder] || 0;
        bValue = statusOrder[b.status as keyof typeof statusOrder] || 0;
        break;
      default:
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
    }

    if (filters.sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return filtered;
} 