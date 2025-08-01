import { TaskStatus, Priority } from "@prisma/client"

// Database types that match Prisma schema
export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  projectId: string
  assigneeId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  description: string | null
  userId: string
  tasks: Task[]
  createdAt: Date
  updatedAt: Date
}

// Re-export Prisma enums
export { TaskStatus, Priority } 