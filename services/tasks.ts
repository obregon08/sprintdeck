import type { TaskWithDetails, TaskFormData, TaskStatus } from '@/types'

const createApiBase = (projectId: string) => `/api/projects/${projectId}/tasks`

export const taskServices = {
  // Fetch all tasks for a project
  async fetchTasks(projectId: string): Promise<TaskWithDetails[]> {
    const response = await fetch(createApiBase(projectId), {
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch tasks")
    }

    return response.json()
  },

  // Fetch a single task by ID
  async fetchTask(projectId: string, taskId: string): Promise<TaskWithDetails> {
    const response = await fetch(`${createApiBase(projectId)}/${taskId}`, {
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch task")
    }

    return response.json()
  },

  // Create a new task
  async createTask(projectId: string, data: TaskFormData): Promise<TaskWithDetails> {
    const response = await fetch(createApiBase(projectId), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create task")
    }

    return response.json()
  },

  // Update an existing task
  async updateTask(projectId: string, taskId: string, data: TaskFormData): Promise<TaskWithDetails> {
    const response = await fetch(`${createApiBase(projectId)}/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update task")
    }

    return response.json()
  },

  // Delete a task
  async deleteTask(projectId: string, taskId: string): Promise<{ message: string }> {
    const response = await fetch(`${createApiBase(projectId)}/${taskId}`, {
      method: "DELETE",
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to delete task")
    }

    return response.json()
  },

  // Update task status only
  async updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Promise<TaskWithDetails> {
    const response = await fetch(`${createApiBase(projectId)}/${taskId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update task status")
    }

    return response.json()
  },
} 