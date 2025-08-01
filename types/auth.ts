// Authentication types
export interface User {
  id: string
  email: string
  name?: string
}

export interface Session {
  user: User
}

export interface AuthError {
  message: string
  code?: string
} 