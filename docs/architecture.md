# Architecture

## Tech Stack

| Layer                | Choice                                      | Why                                     |
| -------------------- | ------------------------------------------- | --------------------------------------- |
| **Frontend**         | Next.js 15 + React 19 + TypeScript         | Latest features, App Router, SSR/SSG    |
|                      | Tailwind CSS + shadcn/ui                   | Utility-first styling, component library |
|                      | next-themes                                 | Dark/light mode support                 |
| **Backend**          | Supabase                                    | Backend-as-a-Service, real-time DB      |
|                      | Supabase Auth                              | Built-in authentication system          |
| **Database**         | Prisma ORM                                  | Type-safe database queries and migrations |
|                      | PostgreSQL (via Supabase)                   | Reliable, scalable database             |
| **State Management** | React Query (TanStack Query)                | Server state management with caching    |
|                      | React Context + useReducer                 | Client state management for filters     |
| **Styling**          | Tailwind CSS                                | Utility-first, responsive design        |
| **Components**       | shadcn/ui + Radix UI                       | Accessible, customizable components     |
| **Development**      | ESLint + TypeScript + Vitest               | Code quality and type safety            |

> **Why this stack?** Next.js provides excellent developer experience with App Router, Supabase offers a complete backend solution, Prisma ensures type-safe database operations, and React Query provides powerful server state management with caching and optimistic updates.

## Full-Stack Architecture

### React Query Integration

React Query provides powerful server state management:

- **Automatic Caching** - Intelligent caching with background updates
- **Optimistic Updates** - Immediate UI feedback with rollback on error
- **Background Refetching** - Keep data fresh automatically
- **Error Handling** - Built-in error states and retry logic
- **DevTools** - Excellent debugging experience

### Database-First Development

Prisma provides a modern database toolkit:

- **Schema-First** - Define your database schema in Prisma schema files
- **Type Generation** - Automatic TypeScript types from your database schema
- **Migrations** - Version-controlled database schema changes
- **Query Builder** - Type-safe database queries with excellent DX

### Supabase Integration

Supabase serves as the database provider:

- **PostgreSQL Database** - Reliable, scalable database with advanced features
- **Real-time Subscriptions** - Live updates across your application
- **Row Level Security** - Fine-grained access control
- **Built-in Auth** - Authentication and authorization out of the box

## Authentication Architecture

### Supabase Auth Integration

The application uses Supabase Auth for user management, which provides:

- **Built-in User Management** - Supabase handles user registration, login, and session management
- **Secure Authentication** - JWT tokens, password reset, email verification
- **Row Level Security** - Database-level security policies
- **Session Management** - Automatic session handling with cookies

### Database Schema Integration

Our Prisma schema works with Supabase Auth by:

- **No User Model** - We don't create a separate User model in Prisma
- **Foreign Key References** - Projects and Tasks reference `auth.users.id` from Supabase
- **Session-Based Queries** - All queries filter by the authenticated user's ID
- **Project Members** - Projects can have multiple members with different roles

```prisma
model Project {
  id          String          @id @default(cuid())
  name        String
  description String?
  userId      String          // References auth.users.id from Supabase
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  members     ProjectMember[]
  tasks       Task[]

  @@map("projects")
}

model ProjectMember {
  id        String     @id @default(cuid())
  projectId String
  userId    String
  role      MemberRole @default(MEMBER)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  project   Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
  @@map("project_members")
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  projectId   String
  assigneeId  String?    // References auth.users.id from Supabase
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  project     Project    @relation(fields: [projectId], references: [id])

  @@map("tasks")
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  REVIEW
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum MemberRole {
  OWNER
  ADMIN
  MEMBER
}
```

### Authentication Flow

1. **User Registration/Login** - Handled by Supabase Auth
2. **Session Management** - Supabase manages JWT tokens and cookies
3. **Database Queries** - Prisma queries filter by authenticated user ID
4. **Row Level Security** - Supabase RLS policies provide additional security

### Middleware-Based Authentication

The application uses Next.js middleware for authentication checks:

```typescript
// middleware.ts
import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### Authentication Flow

1. **Request Interception** - Middleware intercepts all requests
2. **Session Validation** - Checks Supabase session via cookies
3. **Route Protection** - Redirects unauthenticated users to login
4. **Session Management** - Maintains session state across requests

### Protected Routes Logic

The middleware protects all routes except:
- Public assets (`_next/static`, `_next/image`, etc.)
- Authentication pages (`/auth/*`)
- Health check endpoints (`/api/health`)
- Home page (`/`)

```typescript
// lib/supabase/middleware.ts
const { data } = await supabase.auth.getClaims();
const user = data?.claims;

if (
  request.nextUrl.pathname !== "/" &&
  !request.nextUrl.pathname.startsWith("/api/health") &&
  !user &&
  !request.nextUrl.pathname.startsWith("/login") &&
  !request.nextUrl.pathname.startsWith("/auth")
) {
  // Redirect to login if not authenticated
  const url = request.nextUrl.clone();
  url.pathname = "/auth/login";
  return NextResponse.redirect(url);
}
```

### React Query Compatibility

The middleware works seamlessly with React Query:

- **Session Integration** - React Query uses the same session data
- **Route Protection** - Protects React Query pages and mutations
- **Type Safety** - Maintains TypeScript safety throughout
- **Performance** - Minimal overhead with efficient session checks

### Available Auth Pages

* **Sign Up** (`/auth/sign-up`) – User registration with email confirmation
* **Login** (`/auth/login`) – User authentication
* **Forgot Password** (`/auth/forgot-password`) – Password reset flow
* **Update Password** (`/auth/update-password`) – Password change for authenticated users
* **Email Confirmation** (`/auth/confirm`) – Email verification handling
* **Error Page** (`/auth/error`) – Authentication error display

## Project Structure

```text
sprintdeck/
├── app/
│   ├── auth/                    # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   ├── update-password/
│   │   ├── confirm/
│   │   ├── error/
│   │   └── sign-up-success/
│   ├── protected/               # Protected routes
│   ├── api/                    # API routes
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── auth-button.tsx         # Authentication components
│   ├── hero.tsx               # Landing page components
│   └── tutorial/               # Tutorial components
├── hooks/
│   ├── use-projects.ts         # React Query hooks for projects
│   ├── use-tasks.ts           # React Query hooks for tasks
│   ├── use-project-mutations.ts # Mutation hooks
│   └── use-task-mutations.ts   # Task mutation hooks
├── services/
│   ├── projects.ts             # API service functions
│   ├── tasks.ts               # Task API services
│   └── users.ts               # User API services
├── lib/
│   ├── supabase/              # Supabase client configuration
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   └── middleware.ts      # Auth middleware
│   ├── auth-server.ts         # Server-side auth utilities
│   ├── db.ts                  # Prisma database client
│   └── utils.ts               # Utility functions
├── contexts/
│   ├── project-filter-context.tsx # Filter state management
│   └── task-filter-context.tsx    # Task filter state
├── prisma/                    # Database configuration
│   ├── schema.prisma          # Prisma schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Database seeding
├── middleware.ts              # Next.js middleware
└── package.json
```

## Core Features

* **Authentication System** – Complete auth flow with Supabase Auth including sign-up, login, password reset, and email confirmation
* **Protected Routes** – Server-side authentication with middleware protection
* **Modern UI** – Built with Tailwind CSS and shadcn/ui components
* **TypeScript** – Full type safety across the entire application
* **Theme Support** – Dark/light mode with system preference detection
* **Responsive Design** – Mobile-first approach with modern styling
* **Database-First Development** – Prisma schema-driven development with type safety
* **React Query Integration** – Powerful server state management with caching and optimistic updates
* **Filter and Sort** – Advanced filtering and sorting with Context + Reducer pattern
* **Swimlane View** – Kanban-style task management with drag and drop

## API Design

### REST API Endpoints

The application uses traditional REST APIs with React Query for state management:

```typescript
// services/projects.ts
export const projectServices = {
  async fetchProjects(): Promise<ProjectWithTasks[]> {
    const response = await fetch('/api/projects', {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  },
  
  async createProject(data: ProjectFormData): Promise<ProjectWithTasks> {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create project');
    }
    return response.json();
  },
};
```

### React Query Hooks

```typescript
// hooks/use-projects.ts
import { useQuery } from "@tanstack/react-query";
import { projectServices } from "@/services";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: projectServices.fetchProjects,
  });
}

// hooks/use-project-mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateProject() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: projectServices.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push("/protected/projects");
    },
  });
}
```

### Database Operations

All database operations go through Prisma:

- **Queries** - Read operations with type safety
- **Mutations** - Create, update, delete operations
- **Relations** - Automatic handling of relationships
- **Migrations** - Version-controlled schema changes

## Development Workflow

### Database-First Approach

1. **Define Schema** - Update `prisma/schema.prisma`
2. **Generate Types** - Run `npx prisma generate`
3. **Create Migration** - Run `npx prisma migrate dev`
4. **Write Services** - Create API service functions
5. **Build UI** - Use generated types in components

### React Query Conventions

- **Queries** - `hooks/use-[resource].ts`
- **Mutations** - `hooks/use-[resource]-mutations.ts`
- **Services** - `services/[resource].ts`
- **Components** - `components/[resource]-[component].tsx`

This creates a cohesive full-stack development experience with strong conventions and type safety throughout the entire application stack. 