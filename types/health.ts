export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  uptime: number
  environment: string
  version: string
  database: {
    connected: boolean
    tables: {
      projects: boolean
      tasks: boolean
    }
    performance: {
      queryTime: number
      connectionPool: {
        active: number
        idle: number
      }
    }
    projectCount?: number
    taskCount?: number
  }
  system: {
    memory: {
      used: number
      total: number
      percentage: number
    }
    nodeVersion: string
  }
  auth: {
    user?: unknown
    sessionActive: boolean
  }
  errors?: string[]
} 