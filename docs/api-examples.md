# API Documentation

This document provides comprehensive examples of how to use all API endpoints in the SprintDeck application.

## Base URLs
- Projects: `/api/projects`
- Tasks: `/api/projects/{projectId}/tasks`
- Users: `/api/users`
- Health: `/api/health`

## Authentication
All endpoints require authentication. Include your session cookie in requests.

## Projects API

### Endpoints

### 1. List Projects
**GET** `/api/projects`

Returns all projects for the authenticated user (including projects where the user is a member).

**Response:**
```json
[
  {
    "id": "clx1234567890",
    "name": "My Project",
    "description": "A sample project",
    "userId": "user123",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z",
    "members": [
      {
        "id": "member123",
        "projectId": "clx1234567890",
        "userId": "user456",
        "role": "MEMBER",
        "createdAt": "2025-01-15T10:30:00Z",
        "updatedAt": "2025-01-15T10:30:00Z"
      }
    ],
    "tasks": [
      {
        "id": "task123",
        "title": "Sample Task",
        "status": "TODO",
        "priority": "MEDIUM"
      }
    ]
  }
]
```

### 2. Create Project
**POST** `/api/projects`

Creates a new project for the authenticated user.

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Optional project description"
}
```

**Response:**
```json
{
  "id": "clx1234567890",
  "name": "New Project",
  "description": "Optional project description",
  "userId": "user123",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z",
  "members": [],
  "tasks": []
}
```

### 3. Get Project
**GET** `/api/projects/{id}`

Returns a specific project with all its tasks and members.

**Response:**
```json
{
  "id": "clx1234567890",
  "name": "My Project",
  "description": "A sample project",
  "userId": "user123",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z",
  "members": [
    {
      "id": "member123",
      "projectId": "clx1234567890",
      "userId": "user456",
      "role": "MEMBER",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ],
  "tasks": [
    {
      "id": "task123",
      "title": "Sample Task",
      "description": "Task description",
      "status": "TODO",
      "priority": "MEDIUM",
      "projectId": "clx1234567890",
      "assigneeId": null,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

### 4. Update Project
**PUT** `/api/projects/{id}`

Updates an existing project.

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "id": "clx1234567890",
  "name": "Updated Project Name",
  "description": "Updated description",
  "userId": "user123",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T11:00:00Z",
  "members": [...],
  "tasks": [...]
}
```

### 5. Delete Project
**DELETE** `/api/projects/{id}`

Deletes a project and all its associated tasks and members.

**Response:**
```json
{
  "message": "Project deleted successfully"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 400 Bad Request
```json
{
  "error": "Project name is required"
}
```

### 404 Not Found
```json
{
  "error": "Project not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## JavaScript/TypeScript Examples

### Using fetch API
```javascript
// List projects
const projects = await fetch('/api/projects', {
  credentials: 'include'
}).then(res => res.json())

// Create project
const newProject = await fetch('/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({
    name: 'My New Project',
    description: 'Project description'
  })
}).then(res => res.json())

// Update project
const updatedProject = await fetch(`/api/projects/${projectId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({
    name: 'Updated Project Name',
    description: 'Updated description'
  })
}).then(res => res.json())

// Delete project
await fetch(`/api/projects/${projectId}`, {
  method: 'DELETE',
  credentials: 'include'
})
```

### Using React Query
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Fetch projects
const { data: projects, isLoading, error } = useQuery({
  queryKey: ['projects'],
  queryFn: () => fetch('/api/projects', { credentials: 'include' }).then(res => res.json())
})

// Create project mutation
const queryClient = useQueryClient()
const createProjectMutation = useMutation({
  mutationFn: (projectData: { name: string; description?: string }) =>
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(projectData)
    }).then(res => res.json()),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] })
  }
})
```

## Notes

- All endpoints require authentication
- Projects are scoped to the authenticated user (owner or member)
- Deleting a project will cascade delete all associated tasks and members
- Project names are required and cannot be empty
- Descriptions are optional
- All timestamps are in ISO 8601 format
- Project members have roles: OWNER, ADMIN, MEMBER

## Project Members API

### Get Project Members
**GET** `/api/projects/{id}/members`

Returns all members of a specific project.

**Response:**
```json
[
  {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "MEMBER"
  }
]
```

### Add Project Member
**POST** `/api/projects/{id}/members`

Adds a new member to a project. Requires OWNER or ADMIN role.

**Request Body:**
```json
{
  "userId": "user456",
  "role": "MEMBER"
}
```

**Response:**
```json
{
  "message": "User added to project successfully"
}
```

### Remove Project Member
**DELETE** `/api/projects/{id}/members`

Removes a member from a project. Requires OWNER or ADMIN role.

**Request Body:**
```json
{
  "userId": "user456"
}
```

**Response:**
```json
{
  "message": "User removed from project successfully"
}
```

## Project Assignees API

### Get Project Assignees
**GET** `/api/projects/{id}/assignees`

Returns all users who can be assigned to tasks in this project (owner + members).

**Response:**
```json
[
  {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  }
]
```

## Tasks API

### List Tasks
**GET** `/api/projects/{projectId}/tasks`

Returns all tasks for a specific project.

**Response:**
```json
[
  {
    "id": "task-123",
    "title": "Implement user authentication",
    "description": "Add login and registration functionality",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "projectId": "project-456",
    "assigneeId": "user-789",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T11:00:00Z"
  }
]
```

### Create Task
**POST** `/api/projects/{projectId}/tasks`

Creates a new task within a project.

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description (optional)",
  "status": "TODO",
  "priority": "MEDIUM",
  "assigneeId": "user-id (optional)"
}
```

**Status Values:**
- `TODO`
- `IN_PROGRESS`
- `REVIEW`
- `DONE`

**Priority Values:**
- `LOW`
- `MEDIUM`
- `HIGH`
- `URGENT`

**Response:**
```json
{
  "id": "task-123",
  "title": "Task title",
  "description": "Task description",
  "status": "TODO",
  "priority": "MEDIUM",
  "projectId": "project-456",
  "assigneeId": null,
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

### Get Task
**GET** `/api/projects/{projectId}/tasks/{taskId}`

Returns a specific task.

**Response:**
```json
{
  "id": "task-123",
  "title": "Task title",
  "description": "Task description",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "projectId": "project-456",
  "assigneeId": "user-789",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T11:00:00Z"
}
```

### Update Task
**PUT** `/api/projects/{projectId}/tasks/{taskId}`

Updates an existing task.

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "DONE",
  "priority": "HIGH",
  "assigneeId": "user-789"
}
```

**Response:**
```json
{
  "id": "task-123",
  "title": "Updated task title",
  "description": "Updated description",
  "status": "DONE",
  "priority": "HIGH",
  "projectId": "project-456",
  "assigneeId": "user-789",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T12:00:00Z"
}
```

### Update Task Status
**PATCH** `/api/projects/{projectId}/tasks/{taskId}/status`

Updates only the status of a task (used for swimlane drag and drop).

**Request Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Response:**
```json
{
  "id": "task-123",
  "title": "Task title",
  "description": "Task description",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "projectId": "project-456",
  "assigneeId": "user-789",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T12:00:00Z"
}
```

### Delete Task
**DELETE** `/api/projects/{projectId}/tasks/{taskId}`

Deletes a task.

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

## Users API

### Get Users
**GET** `/api/users`

Returns all users in the system.

**Response:**
```json
[
  {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  }
]
```

## Health Check API

### Health Check
**GET** `/api/health`

Returns system health information including database status and performance metrics.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "uptime": 12345,
  "environment": "production",
  "version": "1.0.0",
  "database": {
    "connected": true,
    "tables": {
      "projects": true,
      "tasks": true
    },
    "performance": {
      "queryTime": 5,
      "connectionPool": {
        "active": 2,
        "idle": 8
      }
    },
    "projectCount": 150,
    "taskCount": 890
  },
  "system": {
    "memory": {
      "used": 123456789,
      "total": 1073741824,
      "percentage": 11.5
    },
    "nodeVersion": "v18.17.0"
  },
  "auth": {
    "sessionActive": true,
    "user": {
      "id": "user123",
      "email": "user@example.com"
    }
  }
}
``` 