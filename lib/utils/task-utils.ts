import type { TaskStatus, Assignee } from "@/types";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "TODO":
      return "bg-gray-100 text-gray-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "REVIEW":
      return "bg-yellow-100 text-yellow-800";
    case "DONE":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "LOW":
      return "bg-gray-100 text-gray-800";
    case "MEDIUM":
      return "bg-blue-100 text-blue-800";
    case "HIGH":
      return "bg-orange-100 text-orange-800";
    case "URGENT":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusDisplayName = (status: TaskStatus) => {
  switch (status) {
    case "TODO":
      return "To Do";
    case "IN_PROGRESS":
      return "In Progress";
    case "REVIEW":
      return "Review";
    case "DONE":
      return "Done";
    default:
      return status;
  }
};

export const getAssigneeName = (assigneeId: string | null, assignees?: Assignee[]) => {
  if (!assigneeId || !assignees) return null;
  const assignee = assignees.find(a => a.id === assigneeId);
  return assignee?.name || assignee?.email || null;
}; 