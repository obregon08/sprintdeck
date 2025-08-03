# Projects API Documentation

This document provides examples of how to use the Projects API endpoints for CRUD operations.

## Base URL
All API endpoints are prefixed with `/api/projects`

## Authentication
All endpoints require authentication. Include your session cookie in requests.

## Endpoints

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