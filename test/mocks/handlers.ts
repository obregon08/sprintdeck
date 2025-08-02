import { http, HttpResponse } from 'msw'
import type { ProjectWithTasks, ProjectFormData, TaskWithDetails, TaskFormData } from '@/types'

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

const mockTasks: TaskWithDetails[] = [
  {
    id: 'task1',
    title: 'Test Task 1',
    description: 'A test task',
    status: 'TODO',
    priority: 'MEDIUM',
    projectId: '1',
    assigneeId: null,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
  },
  {
    id: 'task2',
    title: 'Test Task 2',
    description: 'Another test task',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    projectId: '1',
    assigneeId: null,
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
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

  // GET /api/projects/:id/tasks - List tasks
  http.get('/api/projects/:id/tasks', ({ params }) => {
    const tasks = mockTasks.filter(t => t.projectId === params.id)
    return HttpResponse.json(tasks)
  }),

  // GET /api/projects/:id/tasks/:taskId - Get single task
  http.get('/api/projects/:id/tasks/:taskId', ({ params }) => {
    const task = mockTasks.find(t => t.id === params.taskId && t.projectId === params.id)
    if (!task) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(task)
  }),

  // POST /api/projects/:id/tasks - Create task
  http.post('/api/projects/:id/tasks', async ({ params, request }) => {
    const body = await request.json() as TaskFormData
    const newTask: TaskWithDetails = {
      id: 'new-task-id',
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      projectId: params.id as string,
      assigneeId: body.assigneeId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(newTask, { status: 201 })
  }),

  // PUT /api/projects/:id/tasks/:taskId - Update task
  http.put('/api/projects/:id/tasks/:taskId', async ({ params, request }) => {
    const body = await request.json() as TaskFormData
    const taskIndex = mockTasks.findIndex(t => t.id === params.taskId && t.projectId === params.id)

    if (taskIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    const updatedTask: TaskWithDetails = {
      ...mockTasks[taskIndex],
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      assigneeId: body.assigneeId || null,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json(updatedTask)
  }),

  // DELETE /api/projects/:id/tasks/:taskId - Delete task
  http.delete('/api/projects/:id/tasks/:taskId', ({ params }) => {
    const taskIndex = mockTasks.findIndex(t => t.id === params.taskId && t.projectId === params.id)

    if (taskIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json({ message: 'Task deleted successfully' })
  }),
] 