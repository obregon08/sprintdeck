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
| **Full-Stack**       | Blitz.js                                    | Full-stack framework with code generation |
| **Styling**          | Tailwind CSS                                | Utility-first, responsive design        |
| **Components**       | shadcn/ui + Radix UI                       | Accessible, customizable components     |
| **Development**      | ESLint + TypeScript                         | Code quality and type safety            |

> **Why this stack?** Next.js provides excellent developer experience with App Router, Supabase offers a complete backend solution, Prisma ensures type-safe database operations, and Blitz.js provides a full-stack development experience with built-in conventions and code generation.

## Full-Stack Architecture

### Blitz.js Integration

Blitz.js extends Next.js with full-stack capabilities:

- **Server-Side Functions** - Write database queries and business logic in the same file as your components
- **Code Generation** - Automatic generation of CRUD operations, forms, and pages
- **Type Safety** - End-to-end type safety from database to UI
- **Convention over Configuration** - Standardized project structure and patterns

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

```prisma
model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  userId      String   // References auth.users.id from Supabase
  tasks       Task[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("projects")
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  projectId   String
  project     Project    @relation(fields: [projectId], references: [id])
  assigneeId  String?    // References auth.users.id from Supabase
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("tasks")
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

### Blitz.js Compatibility

The middleware works seamlessly with Blitz.js:

- **Session Integration** - Blitz.js uses the same session data
- **Route Protection** - Protects Blitz.js pages and mutations
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
├── lib/
│   ├── supabase/              # Supabase client configuration
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   └── middleware.ts      # Auth middleware
│   ├── auth.ts                # Auth utility for Blitz.js
│   ├── db.ts                  # Prisma database client
│   └── utils.ts               # Utility functions
├── prisma/                    # Database configuration
│   ├── schema.prisma          # Prisma schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Database seeding
├── app/                       # Blitz.js app directory
│   ├── projects/              # Project-related pages and mutations
│   ├── tasks/                 # Task-related pages and mutations
│   └── users/                 # User-related pages and mutations
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
* **Full-Stack Functions** – Server-side functions with Blitz.js for seamless data flow

## Database Schema

### Prisma Schema Structure

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  userId      String   // References auth.users.id from Supabase
  tasks       Task[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("projects")
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  projectId   String
  project     Project    @relation(fields: [projectId], references: [id])
  assigneeId  String?    // References auth.users.id from Supabase
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

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
```

## API Design

### Blitz.js Mutations and Queries

Instead of traditional REST APIs, Blitz.js uses mutations and queries:

```typescript
// app/projects/queries/getProjects.ts
import { db } from "lib/db"
import { auth } from "lib/auth"

export default async function getProjects() {
  const session = await auth()
  if (!session) throw new Error("Not authenticated")
  
  return db.project.findMany({
    where: { userId: session.user.id },
    include: { tasks: true }
  })
}
```

```typescript
// app/projects/mutations/createProject.ts
import { db } from "lib/db"
import { auth } from "lib/auth"

export default async function createProject(input: CreateProjectInput) {
  const session = await auth()
  if (!session) throw new Error("Not authenticated")
  
  return db.project.create({
    data: {
      ...input,
      userId: session.user.id
    }
  })
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
4. **Write Queries** - Create type-safe database operations
5. **Build UI** - Use generated types in components

### Blitz.js Conventions

- **Queries** - `app/[resource]/queries/`
- **Mutations** - `app/[resource]/mutations/`
- **Pages** - `app/[resource]/pages/`
- **Components** - `app/[resource]/components/`

This creates a cohesive full-stack development experience with strong conventions and type safety throughout the entire application stack. 