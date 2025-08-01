import { http, HttpResponse } from 'msw'
import type { ProjectWithTasks, ProjectFormData } from '@/types'

const mockProjects: ProjectWithTasks[] = [
  {
    id: '1',
    name: 'Test Project 1',
    description: 'A test project',
    userId: 'user1',
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    tasks: [
      {
        id: 'task1',
        title: 'Test Task 1',
        status: 'TODO',
        priority: 'MEDIUM',
      },
    ],
  },
  {
    id: '2',
    name: 'Test Project 2',
    description: 'Another test project',
    userId: 'user1',
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
    tasks: [],
  },
]

export const handlers = [
  // GET /api/projects - List projects
  http.get('/api/projects', () => {
    return HttpResponse.json(mockProjects)
  }),

  // GET /api/projects/:id - Get single project
  http.get('/api/projects/:id', ({ params }) => {
    const project = mockProjects.find(p => p.id === params.id)
    if (!project) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(project)
  }),

  // POST /api/projects - Create project
  http.post('/api/projects', async ({ request }) => {
    const body = await request.json() as ProjectFormData
    const newProject: ProjectWithTasks = {
      id: 'new-project-id',
      name: body.name,
      description: body.description,
      userId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: [],
    }
    return HttpResponse.json(newProject, { status: 201 })
  }),

  // PUT /api/projects/:id - Update project
  http.put('/api/projects/:id', async ({ params, request }) => {
    const body = await request.json() as ProjectFormData
    const projectIndex = mockProjects.findIndex(p => p.id === params.id)
    
    if (projectIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    const updatedProject: ProjectWithTasks = {
      ...mockProjects[projectIndex],
      name: body.name,
      description: body.description,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json(updatedProject)
  }),

  // DELETE /api/projects/:id - Delete project
  http.delete('/api/projects/:id', ({ params }) => {
    const projectIndex = mockProjects.findIndex(p => p.id === params.id)
    
    if (projectIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json({ message: 'Project deleted successfully' })
  }),
] 