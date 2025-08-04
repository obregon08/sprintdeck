import type { TaskStatus, Priority } from "@prisma/client"

export interface Assignee {
  id: string;
  email: string;
  name?: string;
}

export interface TaskWithDetails {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  projectId: string;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId?: string | null;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string | null;
}

export interface UpdateTaskData {
  id: string;
  data: TaskFormData;
}

export interface TaskListProps {
  projectId: string;
}

export interface TaskFormProps {
  mode?: "create" | "edit";
  projectId: string;
  initialData?: {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: Priority;
    assigneeId: string | null;
  };
}

export interface DraggableTaskCardProps {
  task: TaskWithDetails;
  projectId: string;
  onDelete: (taskId: string) => void;
  isUpdating: boolean;
  userRole?: { role: string };
  assignees?: Assignee[];
} 