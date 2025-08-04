// Form input types
export interface CreateProjectInput {
  name: string
  description?: string
}

export interface UpdateProjectInput {
  name?: string
  description?: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  status?: string
  priority?: string
  projectId: string
  assigneeId?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: string
  priority?: string
  assigneeId?: string
}

export interface ContactFormData {
  name: string
  email: string
  message: string
} 