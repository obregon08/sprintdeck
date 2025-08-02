import { describe, it, expect, beforeEach, vi } from 'vitest'
import { taskServices } from '../tasks'
import type { TaskFormData } from '@/types'

describe('taskServices', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    vi.clearAllMocks()
  })

  describe('fetchTasks', () => {
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

      const result = await taskServices.fetchTasks('project-1')

      expect(fetch).toHaveBeenCalledWith('/api/projects/project-1/tasks', {
        credentials: 'include',
      })
      expect(result).toEqual(mockTasks)
    })

    it('throws error when fetch fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      })

      await expect(taskServices.fetchTasks('project-1')).rejects.toThrow(
        'Failed to fetch tasks'
      )
    })
  })

  describe('fetchTask', () => {
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

      const result = await taskServices.fetchTask('project-1', '1')

      expect(fetch).toHaveBeenCalledWith('/api/projects/project-1/tasks/1', {
        credentials: 'include',
      })
      expect(result).toEqual(mockTask)
    })

    it('throws error when fetch fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      })

      await expect(taskServices.fetchTask('project-1', '1')).rejects.toThrow(
        'Failed to fetch task'
      )
    })
  })

  describe('createTask', () => {
    it('creates task successfully', async () => {
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

      const result = await taskServices.createTask('project-1', taskData)

      expect(fetch).toHaveBeenCalledWith('/api/projects/project-1/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(taskData),
      })
      expect(result).toEqual(mockResponse)
    })

    it('throws error when creation fails', async () => {
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

      await expect(taskServices.createTask('project-1', taskData)).rejects.toThrow(
        'Task title is required'
      )
    })
  })

  describe('updateTask', () => {
    it('updates task successfully', async () => {
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

      const result = await taskServices.updateTask('project-1', '1', taskData)

      expect(fetch).toHaveBeenCalledWith('/api/projects/project-1/tasks/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(taskData),
      })
      expect(result).toEqual(mockResponse)
    })

    it('throws error when update fails', async () => {
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

      await expect(taskServices.updateTask('project-1', '1', taskData)).rejects.toThrow(
        'Task not found'
      )
    })
  })

  describe('deleteTask', () => {
    it('deletes task successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Task deleted successfully' }),
      })

      const result = await taskServices.deleteTask('project-1', '1')

      expect(fetch).toHaveBeenCalledWith('/api/projects/project-1/tasks/1', {
        method: 'DELETE',
        credentials: 'include',
      })
      expect(result).toEqual({ message: 'Task deleted successfully' })
    })

    it('throws error when deletion fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Task not found' }),
      })

      await expect(taskServices.deleteTask('project-1', '1')).rejects.toThrow(
        'Task not found'
      )
    })
  })
}) 