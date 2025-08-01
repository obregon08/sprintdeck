import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth-server'

interface HealthCheckResult {
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
    user?: any
    sessionActive: boolean
  }
  errors?: string[]
}

export async function GET() {
  const startTime = Date.now()
  const errors: string[] = []
  const healthData: HealthCheckResult = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    database: {
      connected: false,
      tables: {
        projects: false,
        tasks: false
      },
      performance: {
        queryTime: 0,
        connectionPool: {
          active: 0,
          idle: 0
        }
      }
    },
    system: {
      memory: {
        used: 0,
        total: 0,
        percentage: 0
      },
      nodeVersion: process.version
    },
    auth: {
      sessionActive: false
    }
  }

  try {
    // Test database connectivity
    try {
      await db.$connect()
      healthData.database.connected = true
    } catch (error) {
      errors.push(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      healthData.database.connected = false
    }

    // Test table existence and basic queries
    if (healthData.database.connected) {
      try {
        // Test projects table
        const projectCount = await db.project.count()
        healthData.database.tables.projects = true
        healthData.database.projectCount = projectCount
      } catch (error) {
        errors.push(`Projects table check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        healthData.database.tables.projects = false
      }

      try {
        // Test tasks table
        const taskCount = await db.task.count()
        healthData.database.tables.tasks = true
        healthData.database.taskCount = taskCount
      } catch (error) {
        errors.push(`Tasks table check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        healthData.database.tables.tasks = false
      }

      // Performance test - measure query time
      try {
        const perfStart = Date.now()
        await db.$queryRaw`SELECT 1`
        healthData.database.performance.queryTime = Date.now() - perfStart
      } catch (error) {
        errors.push(`Performance test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Get session and auth info
    try {
      const session = await getSession()
      healthData.auth.sessionActive = !!session
      healthData.auth.user = session?.user || null
    } catch (error) {
      errors.push(`Auth check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // System metrics
    try {
      const memUsage = process.memoryUsage()
      healthData.system.memory = {
        used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
      }
    } catch (error) {
      errors.push(`System metrics failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Determine overall status
    const queryTime = Date.now() - startTime
    healthData.database.performance.queryTime = queryTime

    if (errors.length > 0) {
      healthData.status = errors.some(error => error.includes('Database connection failed')) ? 'unhealthy' : 'degraded'
      healthData.errors = errors
    } else if (queryTime > 5000) { // 5 seconds threshold
      healthData.status = 'degraded'
      errors.push('Health check took too long')
      healthData.errors = errors
    }

    const statusCode = healthData.status === 'healthy' ? 200 : healthData.status === 'degraded' ? 200 : 503

    return NextResponse.json(healthData, { status: statusCode })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: errorMessage,
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          tables: { projects: false, tasks: false },
          performance: { queryTime: 0, connectionPool: { active: 0, idle: 0 } }
        },
        system: {
          memory: { used: 0, total: 0, percentage: 0 },
          nodeVersion: process.version
        },
        auth: { sessionActive: false }
      }, 
      { status: 503 }
    )
  } finally {
    // Always disconnect to clean up connections
    try {
      await db.$disconnect()
    } catch (error) {
      // Ignore disconnect errors
    }
  }
} 