import { rest } from 'msw'
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
  rest.get('/api/projects', (req, res, ctx) => {
    return res(ctx.json(mockProjects))
  }),

  // GET /api/projects/:id - Get single project
  rest.get('/api/projects/:id', (req, res, ctx) => {
    const project = mockProjects.find(p => p.id === req.params.id)
    if (!project) {
      return res(ctx.status(404))
    }
    return res(ctx.json(project))
  }),

  // POST /api/projects - Create project
  rest.post('/api/projects', async (req, res, ctx) => {
    const body = await req.json() as ProjectFormData
    const newProject: ProjectWithTasks = {
      id: 'new-project-id',
      name: body.name,
      description: body.description,
      userId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: [],
    }
    return res(ctx.status(201), ctx.json(newProject))
  }),

  // PUT /api/projects/:id - Update project
  rest.put('/api/projects/:id', async (req, res, ctx) => {
    const body = await req.json() as ProjectFormData
    const projectIndex = mockProjects.findIndex(p => p.id === req.params.id)

    if (projectIndex === -1) {
      return res(ctx.status(404))
    }

    const updatedProject: ProjectWithTasks = {
      ...mockProjects[projectIndex],
      name: body.name,
      description: body.description,
      updatedAt: new Date().toISOString(),
    }

    return res(ctx.json(updatedProject))
  }),

  // DELETE /api/projects/:id - Delete project
  rest.delete('/api/projects/:id', (req, res, ctx) => {
    const projectIndex = mockProjects.findIndex(p => p.id === req.params.id)

    if (projectIndex === -1) {
      return res(ctx.status(404))
    }

    return res(ctx.json({ message: 'Project deleted successfully' }))
  }),

  // GET /api/projects/:id/tasks - List tasks
  rest.get('/api/projects/:id/tasks', (req, res, ctx) => {
    const tasks = mockTasks.filter(t => t.projectId === req.params.id)
    return res(ctx.json(tasks))
  }),

  // GET /api/projects/:id/tasks/:taskId - Get single task
  rest.get('/api/projects/:id/tasks/:taskId', (req, res, ctx) => {
    const task = mockTasks.find(t => t.id === req.params.taskId && t.projectId === req.params.id)
    if (!task) {
      return res(ctx.status(404))
    }
    return res(ctx.json(task))
  }),

  // POST /api/projects/:id/tasks - Create task
  rest.post('/api/projects/:id/tasks', async (req, res, ctx) => {
    const body = await req.json() as TaskFormData
    const newTask: TaskWithDetails = {
      id: 'new-task-id',
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      projectId: req.params.id as string,
      assigneeId: body.assigneeId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return res(ctx.status(201), ctx.json(newTask))
  }),

  // PUT /api/projects/:id/tasks/:taskId - Update task
  rest.put('/api/projects/:id/tasks/:taskId', async (req, res, ctx) => {
    const body = await req.json() as TaskFormData
    const taskIndex = mockTasks.findIndex(t => t.id === req.params.taskId && t.projectId === req.params.id)

    if (taskIndex === -1) {
      return res(ctx.status(404))
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

    return res(ctx.json(updatedTask))
  }),

  // DELETE /api/projects/:id/tasks/:taskId - Delete task
  rest.delete('/api/projects/:id/tasks/:taskId', (req, res, ctx) => {
    const taskIndex = mockTasks.findIndex(t => t.id === req.params.taskId && t.projectId === req.params.id)

    if (taskIndex === -1) {
      return res(ctx.status(404))
    }

    return res(ctx.json({ message: 'Task deleted successfully' }))
  }),
] 