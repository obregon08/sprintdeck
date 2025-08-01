export interface ProjectWithTasks {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
  }>;
}

export interface ProjectFormData {
  name: string;
  description: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
}

export interface UpdateProjectData {
  id: string;
  data: ProjectFormData;
}

export interface ProjectFormProps {
  mode?: "create" | "edit";
  initialData?: {
    id: string;
    name: string;
    description: string | null;
  };
}

export interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export interface EditProjectPageProps {
  params: Promise<{ id: string }>;
} 