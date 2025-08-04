# Setup Guide

## Prerequisites

* Node.js >= 18
* npm, yarn, or pnpm
* Supabase account (free tier available)

## Installation

### 1. Clone and install

```bash
git clone https://github.com/your-org/sprintdeck.git
cd sprintdeck
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_supabase_database_url
DIRECT_URL=your_supabase_direct_database_url
```

### 3. Initialize Prisma

```bash
npx prisma init
```

This creates the initial Prisma configuration. The schema has been pre-configured with Project, Task, and ProjectMember models that work with Supabase Auth.

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npm run db:seed
```

### 5. Start development server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 6. Test the authentication flow

1. Visit the home page
2. Click "Sign Up" to create an account
3. Check your email for the confirmation link
4. Sign in and explore the protected page

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (for admin operations) | Yes |
| `DATABASE_URL` | Your Supabase PostgreSQL connection string | Yes |
| `DIRECT_URL` | Your Supabase direct PostgreSQL connection string (for migrations) | Yes |
| `VERCEL_URL` | Vercel deployment URL (auto-set) | No |

## Database Setup

### Supabase Auth Integration

Our database schema works with Supabase Auth:

- **No User Model** - We don't create a separate User model in Prisma
- **Supabase Auth Users** - User management is handled by Supabase Auth
- **Foreign Key References** - Projects and Tasks reference `auth.users.id` from Supabase
- **Session-Based Queries** - All queries filter by the authenticated user's ID
- **Project Members** - Projects can have multiple members with different roles

### Prisma Configuration

The `prisma/schema.prisma` file defines your database schema with models that work with Supabase Auth:

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

### Database Migrations

Create and apply database migrations:

```bash
# Create a new migration
npm run db:migrate

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Database Seeding

Create seed data for development:

```bash
# Run the seed script
npm run db:seed
```

The seed script creates sample data including:
- Sample project with tasks
- Different task statuses and priorities
- Note: User creation is handled by Supabase Auth, not the seed script

## React Query Setup

### Project Structure

The application uses React Query for server state management:

```
hooks/
├── use-projects.ts           # Project query hooks
├── use-tasks.ts             # Task query hooks
├── use-project-mutations.ts # Project mutation hooks
└── use-task-mutations.ts    # Task mutation hooks

services/
├── projects.ts              # Project API services
├── tasks.ts                 # Task API services
└── users.ts                 # User API services
```

### Example Queries and Mutations

The project includes sample queries and mutations that work with Supabase Auth:

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
import { projectServices } from "@/services";

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

## Development Workflow

### Database-First Development

1. **Update Schema** - Modify `prisma/schema.prisma`
2. **Generate Types** - Run `npm run db:generate`
3. **Create Migration** - Run `npm run db:migrate`
4. **Write Services** - Create API service functions
5. **Build UI** - Use generated types in components

### Authentication Integration

When working with React Query hooks and services:

1. **Import Services** - Use `import { projectServices } from "@/services"`
2. **Create Hooks** - Use `useQuery` and `useMutation` from React Query
3. **Handle Errors** - Implement proper error handling in mutations
4. **Cache Management** - Use `queryClient.invalidateQueries` for cache updates

### Common Commands

```bash
# Database operations
npm run db:studio          # Open database GUI
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Create and apply migration
npm run db:seed            # Seed database with sample data

# Development
npm run dev                # Start development server
npm run build              # Build for production
npm run lint               # Run ESLint
npm run test               # Run tests
```

## Available Scripts

```bash
npm run dev                # Start development server
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint
npm run test               # Run tests with Vitest
npm run test:watch         # Run tests in watch mode
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Create and apply migration
npm run db:studio          # Open Prisma Studio
npm run db:seed            # Seed database
``` 