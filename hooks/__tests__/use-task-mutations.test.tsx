import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCreateTask, useUpdateTask, useDeleteTask } from '../use-task-mutations'
import type { TaskFormData } from '@/types'

// Mock the router
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock console.error to suppress error logging in tests
const originalConsoleError = console.error
beforeEach(() => {
  console.error = vi.fn()
})

afterEach(() => {
  console.error = originalConsoleError
})

// Create a wrapper component for testing hooks
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return Wrapper
}

describe('useCreateTask', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates task successfully and redirects', async () => {
    const taskData: TaskFormData = {
      title: 'New Task',
      description: 'A new task',
      status: 'TODO',
      priority: 'HIGH',
      assigneeId: 'user-1',
    }

    const mockResponse = {
      id: 'new-task-id',
      title: 'New Task',
      description: 'A new task',
      status: 'TODO',
      priority: 'HIGH',
      projectId: 'project-1',
      assigneeId: 'user-1',
      createdAt: '2025-01-15T10:30:00Z',
      updatedAt: '2025-01-15T10:30:00Z',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ projectId: 'project-1', data: taskData })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockPush).toHaveBeenCalledWith('/protected/projects/project-1')
  })

  it('handles error when creation fails', async () => {
    const taskData: TaskFormData = {
      title: 'New Task',
      description: 'A new task',
      status: 'TODO',
      priority: 'HIGH',
      assigneeId: 'user-1',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Task title is required' }),
    })

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ projectId: 'project-1', data: taskData })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(mockPush).not.toHaveBeenCalled()
  })
})

describe('useUpdateTask', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates task successfully and redirects', async () => {
    const taskData: TaskFormData = {
      title: 'Updated Task',
      description: 'Updated description',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      assigneeId: 'user-1',
    }

    const mockResponse = {
      id: '1',
      title: 'Updated Task',
      description: 'Updated description',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      projectId: 'project-1',
      assigneeId: 'user-1',
      createdAt: '2025-01-15T10:30:00Z',
      updatedAt: '2025-01-15T11:00:00Z',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const { result } = renderHook(() => useUpdateTask(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ projectId: 'project-1', taskId: '1', data: taskData })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockPush).toHaveBeenCalledWith('/protected/projects/project-1')
  })

  it('handles error when update fails', async () => {
    const taskData: TaskFormData = {
      title: 'Updated Task',
      description: 'Updated description',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      assigneeId: 'user-1',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Task not found' }),
    })

    const { result } = renderHook(() => useUpdateTask(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ projectId: 'project-1', taskId: '1', data: taskData })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(mockPush).not.toHaveBeenCalled()
  })
})

describe('useDeleteTask', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes task successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Task deleted successfully' }),
    })

    const { result } = renderHook(() => useDeleteTask(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ projectId: 'project-1', taskId: '1' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockPush).not.toHaveBeenCalled() // Delete doesn't redirect
  })

  it('handles error when deletion fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Task not found' }),
    })

    const { result } = renderHook(() => useDeleteTask(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ projectId: 'project-1', taskId: '1' })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
}) 