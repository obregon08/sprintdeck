# Tasks API Documentation

This document describes the API endpoints for managing tasks within projects.

## Base URL

All task endpoints are prefixed with `/api/projects/{projectId}/tasks`

## Authentication

All endpoints require authentication. Include credentials in requests.

## Endpoints

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

### Delete Task

**DELETE** `/api/projects/{projectId}/tasks/{taskId}`

Deletes a task.

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Task title is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Project not found"
}
```
or
```json
{
  "error": "Task not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Examples

### Create a new task
```bash
curl -X POST /api/projects/project-123/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement feature X",
    "description": "Add the new feature as discussed",
    "status": "TODO",
    "priority": "HIGH"
  }'
```

### Update task status
```bash
curl -X PUT /api/projects/project-123/tasks/task-456 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement feature X",
    "description": "Add the new feature as discussed",
    "status": "IN_PROGRESS",
    "priority": "HIGH"
  }'
```

### Delete a task
```bash
curl -X DELETE /api/projects/project-123/tasks/task-456
``` 