import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTasks, useTask } from '../use-tasks'

// Create a wrapper component for testing hooks
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return Wrapper
}

describe('useTasks', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
  })

  it('fetches tasks successfully', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Test Task',
        description: 'A test task',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: 'project-1',
        assigneeId: null,
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-01-15T10:30:00Z',
      },
    ]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTasks),
    })

    const { result } = renderHook(() => useTasks('project-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual(mockTasks)
    expect(result.current.error).toBeNull()
  })

  it('handles error when fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    })

    const { result } = renderHook(() => useTasks('project-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.data).toBeUndefined()
  })

  it('does not fetch when projectId is empty', () => {
    const { result } = renderHook(() => useTasks(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })
})

describe('useTask', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
  })

  it('fetches single task successfully', async () => {
    const mockTask = {
      id: '1',
      title: 'Test Task',
      description: 'A test task',
      status: 'TODO',
      priority: 'MEDIUM',
      projectId: 'project-1',
      assigneeId: null,
      createdAt: '2025-01-15T10:30:00Z',
      updatedAt: '2025-01-15T10:30:00Z',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTask),
    })

    const { result } = renderHook(() => useTask('project-1', '1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual(mockTask)
    expect(result.current.error).toBeNull()
  })

  it('handles error when fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    })

    const { result } = renderHook(() => useTask('project-1', '1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.data).toBeUndefined()
  })

  it('does not fetch when projectId or taskId is empty', () => {
    const { result } = renderHook(() => useTask('', '1'), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })
}) 