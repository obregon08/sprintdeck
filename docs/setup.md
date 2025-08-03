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

### 2. Install Blitz.js and Prisma

```bash
npm install @blitzjs/next @prisma/client prisma zod
npm install -D tsx
```

### 3. Set up Supabase

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
```

### 4. Initialize Prisma

```bash
npx prisma init
```

This creates the initial Prisma configuration. The schema has been pre-configured with Project and Task models that work with Supabase Auth.

### 5. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npm run db:seed
```

### 6. Start development server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 7. Test the authentication flow

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
| `VERCEL_URL` | Vercel deployment URL (auto-set) | No |

## Database Setup

### Supabase Auth Integration

Our database schema works with Supabase Auth:

- **No User Model** - We don't create a separate User model in Prisma
- **Supabase Auth Users** - User management is handled by Supabase Auth
- **Foreign Key References** - Projects and Tasks reference `auth.users.id` from Supabase
- **Session-Based Queries** - All queries filter by the authenticated user's ID

### Prisma Configuration

The `prisma/schema.prisma` file defines your database schema with models that work with Supabase Auth:

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

## Blitz.js Setup

### Project Structure

Blitz.js follows a convention-based structure:

```
app/
├── projects/
│   ├── queries/
│   ├── mutations/
│   └── pages/
├── tasks/
│   ├── queries/
│   ├── mutations/
│   └── pages/
└── users/
    ├── queries/
    ├── mutations/
    └── pages/
```

### Code Generation

Blitz.js can generate CRUD operations:

```bash
# Generate a new resource
blitz generate all project name:string description:string?

# Generate specific parts
blitz generate query getProjects
blitz generate mutation createProject
blitz generate page projects
```

### Example Queries and Mutations

The project includes sample queries and mutations that work with Supabase Auth:

```typescript
// app/projects/queries/getProjects.ts
import { db } from "lib/db"
import { auth } from "lib/auth"

export default async function getProjects() {
  const session = await auth()
  if (!session) throw new Error("Not authenticated")
  
  return db.project.findMany({
    where: { userId: session.user.id },
    include: {
      tasks: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}
```

```typescript
// app/projects/mutations/createProject.ts
import { db } from "lib/db"
import { auth } from "lib/auth"
import { z } from "zod"

const CreateProject = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
})

export default async function createProject(input: z.infer<typeof CreateProject>) {
  const session = await auth()
  if (!session) throw new Error("Not authenticated")

  return db.project.create({
    data: {
      ...input,
      userId: session.user.id,
    },
  })
}
```

## Development Workflow

### Database-First Development

1. **Update Schema** - Modify `prisma/schema.prisma`
2. **Generate Types** - Run `npm run db:generate`
3. **Create Migration** - Run `npm run db:migrate`
4. **Write Queries/Mutations** - Create type-safe operations
5. **Build UI** - Use generated types in components

### Authentication Integration

When working with Blitz.js queries and mutations:

1. **Import Auth Utility** - Use `import { auth } from "lib/auth"`
2. **Get Session** - Call `const session = await auth()`
3. **Check Authentication** - Verify `if (!session) throw new Error("Not authenticated")`
4. **Use User ID** - Access `session.user.id` for database operations

### Common Commands

```bash
# Database operations
npm run db:studio          # Open database GUI
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Create and apply migration
npm run db:seed            # Seed database with sample data

# Blitz.js operations
npm run blitz:codegen      # Generate types and utilities
```

## Available Scripts

```bash
npm run dev                # Start development server
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Create and apply migration
npm run db:studio          # Open Prisma Studio
npm run db:seed            # Seed database
npm run blitz:codegen      # Generate Blitz.js types
``` 