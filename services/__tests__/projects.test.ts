import { describe, it, expect, beforeEach, vi } from 'vitest'
import { projectServices } from '../projects'
import type { ProjectFormData } from '@/types'

describe('projectServices', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    vi.clearAllMocks()
  })

  describe('fetchProjects', () => {
    it('fetches projects successfully', async () => {
      const mockProjects = [
        {
          id: '1',
          name: 'Test Project',
          description: 'A test project',
          userId: 'user1',
          createdAt: '2025-01-15T10:30:00Z',
          updatedAt: '2025-01-15T10:30:00Z',
          tasks: [],
        },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProjects),
      })

      const result = await projectServices.fetchProjects()

      expect(fetch).toHaveBeenCalledWith('/api/projects', {
        credentials: 'include',
      })
      expect(result).toEqual(mockProjects)
    })

    it('throws error when fetch fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      })

      await expect(projectServices.fetchProjects()).rejects.toThrow(
        'Failed to fetch projects'
      )
    })
  })

  describe('createProject', () => {
    it('creates project successfully', async () => {
      const projectData: ProjectFormData = {
        name: 'New Project',
        description: 'A new project',
      }

      const mockResponse = {
        id: 'new-id',
        name: 'New Project',
        description: 'A new project',
        userId: 'user1',
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-01-15T10:30:00Z',
        tasks: [],
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await projectServices.createProject(projectData)

      expect(fetch).toHaveBeenCalledWith('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(projectData),
      })
      expect(result).toEqual(mockResponse)
    })

    it('throws error when creation fails', async () => {
      const projectData: ProjectFormData = {
        name: 'New Project',
        description: 'A new project',
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Project name is required' }),
      })

      await expect(projectServices.createProject(projectData)).rejects.toThrow(
        'Project name is required'
      )
    })
  })

  describe('updateProject', () => {
    it('updates project successfully', async () => {
      const projectData: ProjectFormData = {
        name: 'Updated Project',
        description: 'Updated description',
      }

      const mockResponse = {
        id: '1',
        name: 'Updated Project',
        description: 'Updated description',
        userId: 'user1',
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-01-15T11:00:00Z',
        tasks: [],
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await projectServices.updateProject({
        id: '1',
        data: projectData,
      })

      expect(fetch).toHaveBeenCalledWith('/api/projects/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(projectData),
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deleteProject', () => {
    it('deletes project successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Project deleted successfully' }),
      })

      const result = await projectServices.deleteProject('1')

      expect(fetch).toHaveBeenCalledWith('/api/projects/1', {
        method: 'DELETE',
        credentials: 'include',
      })
      expect(result).toEqual({ message: 'Project deleted successfully' })
    })
  })
}) 