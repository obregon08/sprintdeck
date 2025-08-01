# Development Guide

## Getting Started

### Prerequisites

* Node.js >= 18
* npm, yarn, or pnpm
* Supabase account (free tier available)

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
blitz codegen        # Generate Blitz.js types and utilities
```

## Code Quality

- **ESLint** – Code linting with Next.js configuration
- **TypeScript** – Type checking across the entire application
- **Prettier** – Code formatting (configured via ESLint)
- **Prisma** – Type-safe database operations
- **Blitz.js** – Full-stack development conventions

## Authentication & Middleware

### Middleware-Based Protection

The application uses Next.js middleware for authentication:

```typescript
// middleware.ts
import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
```

### How It Works

1. **Request Interception** - Middleware runs on every request
2. **Session Check** - Validates Supabase session via cookies
3. **Route Protection** - Redirects unauthenticated users to `/auth/login`
4. **Session Management** - Maintains session state across requests

### Protected Routes

The middleware automatically protects all routes except:
- Public assets (`_next/static`, `_next/image`, etc.)
- Authentication pages (`/auth/*`)
- Health check endpoints (`/api/health`)
- Home page (`/`)

### Working with Protected Routes

When creating new pages that require authentication:

```typescript
// app/projects/pages/projects.tsx
import { useQuery } from "@blitzjs/rpc"
import getProjects from "app/projects/queries/getProjects"

export default function ProjectsPage() {
  // This page is automatically protected by middleware
  // If user is not authenticated, they'll be redirected to /auth/login
  const [projects] = useQuery(getProjects)
  
  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  )
}
```

### Public Routes

To create public routes, add them to the middleware exclusion logic:

```typescript
// lib/supabase/middleware.ts
if (
  request.nextUrl.pathname !== "/" &&
  !request.nextUrl.pathname.startsWith("/api/health") &&
  !request.nextUrl.pathname.startsWith("/public") && // Add public routes
  !user &&
  !request.nextUrl.pathname.startsWith("/login") &&
  !request.nextUrl.pathname.startsWith("/auth")
) {
  // Redirect logic
}
```

## Full-Stack Development

### Blitz.js Patterns

Blitz.js provides a full-stack development experience with strong conventions:

#### Queries (Data Fetching)

```typescript
// app/projects/queries/getProjects.ts
import { db } from "db"
import { auth } from "lib/auth"

export default async function getProjects() {
  const session = await auth()
  if (!session) throw new Error("Not authenticated")
  
  return db.project.findMany({
    where: { userId: session.userId },
    include: { tasks: true },
    orderBy: { createdAt: "desc" }
  })
}
```

#### Mutations (Data Modifications)

```typescript
// app/projects/mutations/createProject.ts
import { db } from "db"
import { auth } from "lib/auth"
import { z } from "zod"

const CreateProject = z.object({
  name: z.string().min(1),
  description: z.string().optional()
})

export default async function createProject(input: z.infer<typeof CreateProject>) {
  const session = await auth()
  if (!session) throw new Error("Not authenticated")
  
  return db.project.create({
    data: {
      ...input,
      userId: session.userId
    }
  })
}
```

#### Using in Components

```typescript
// app/projects/pages/projects.tsx
import { useQuery, useMutation } from "@blitzjs/rpc"
import getProjects from "app/projects/queries/getProjects"
import createProject from "app/projects/mutations/createProject"

export default function ProjectsPage() {
  const [projects] = useQuery(getProjects)
  const [createProjectMutation] = useMutation(createProject)
  
  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  )
}
```

### Database-First Development

#### Schema Management

1. **Define Models** in `db/schema.prisma`
2. **Generate Types** with `npx prisma generate`
3. **Create Migrations** with `npx prisma migrate dev`
4. **Use Generated Types** in your code

#### Type Safety

Prisma provides end-to-end type safety:

```typescript
// Types are automatically generated from your schema
import { Project, Task, User } from "@prisma/client"

// Use in queries
const projects: Project[] = await db.project.findMany({
  include: { tasks: true, user: true }
})

// Use in mutations
const project: Project = await db.project.create({
  data: {
    name: "New Project",
    userId: "user-id"
  }
})
```

## Customization

### Adding New Pages

1. Create a new directory in `app/`
2. Add a `page.tsx` file
3. Export a default React component

Example:
```typescript
// app/dashboard/page.tsx
import { useQuery } from "@blitzjs/rpc"
import getProjects from "app/projects/queries/getProjects"

export default function DashboardPage() {
  const [projects] = useQuery(getProjects)
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>You have {projects.length} projects</p>
    </div>
  )
}
```

### Styling

- **Tailwind CSS** – Use utility classes for styling
- **shadcn/ui** – Import and customize components from `components/ui/`
- **Global Styles** – Modify `app/globals.css` for global styles

### Database

- **Prisma Studio** – Visual database management with `npx prisma studio`
- **Migrations** – Version-controlled schema changes
- **Seeding** – Populate database with test data
- **Supabase Dashboard** – Manage your database schema and data
- **Real-time** – Enable real-time subscriptions for live updates
- **Row Level Security** – Configure RLS policies for data security

## Project Structure

### Key Directories

```
sprintdeck/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── protected/         # Protected routes
│   ├── projects/          # Project-related pages and mutations
│   ├── tasks/             # Task-related pages and mutations
│   └── users/             # User-related pages and mutations
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── auth-button.tsx   # Custom components
├── lib/                  # Utility functions
│   └── supabase/         # Supabase configuration
├── db/                   # Database configuration
│   ├── schema.prisma     # Prisma schema
│   ├── migrations/       # Database migrations
│   └── seed.ts          # Database seeding
├── middleware.ts         # Next.js middleware
└── package.json
```

### Component Guidelines

1. **Use TypeScript** for all components
2. **Follow naming conventions** - PascalCase for components
3. **Use shadcn/ui components** when possible
4. **Keep components focused** - single responsibility
5. **Add proper TypeScript types**
6. **Use Blitz.js queries/mutations** for data operations
7. **Leverage Prisma types** for type safety

### Authentication Flow

The authentication system uses Supabase Auth with the following flow:

1. **Sign Up** → Email confirmation
2. **Login** → Redirect to protected page
3. **Password Reset** → Email-based reset
4. **Protected Routes** → Server-side auth check via middleware
5. **Session Management** → Blitz.js session handling

## Best Practices

### Code Organization

- Keep components small and focused
- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful variable and function names
- Organize by feature, not by type
- Use Blitz.js conventions for queries and mutations

### Performance

- Use Next.js Image component for images
- Implement proper loading states
- Optimize bundle size
- Use React.memo for expensive components
- Leverage Prisma's query optimization
- Use Blitz.js caching strategies

### Security

- Never expose sensitive data in client-side code
- Use environment variables for secrets
- Implement proper authentication checks
- Validate user input with Zod schemas
- Use Prisma's built-in SQL injection protection
- Leverage Supabase Row Level Security

### Database Best Practices

- **Schema Design**: Plan your database schema carefully
- **Migrations**: Always use migrations for schema changes
- **Indexing**: Add indexes for frequently queried fields
- **Relationships**: Use proper foreign key relationships
- **Validation**: Validate data at the schema level
- **Seeding**: Use seed data for development and testing

## Testing

### Manual Testing Checklist

- [ ] Authentication flow (sign up, login, logout)
- [ ] Protected routes access (middleware protection)
- [ ] Database operations (CRUD)
- [ ] Blitz.js queries and mutations
- [ ] Responsive design on different screen sizes
- [ ] Dark/light theme switching
- [ ] Form validation
- [ ] Error handling

### Future Testing Plans

- Unit tests with Jest
- Integration tests with Playwright
- E2E tests for critical user flows
- Performance testing
- Database testing with Prisma

## Debugging

### Common Issues

1. **Supabase Connection**
   - Check environment variables
   - Verify Supabase project is active
   - Check network connectivity

2. **Authentication Issues**
   - Verify redirect URLs in Supabase
   - Check email confirmation flow
   - Review browser console for errors
   - Check middleware configuration

3. **Build Errors**
   - Run `npm run lint` to check for issues
   - Verify TypeScript types
   - Check for missing dependencies

4. **Database Issues**
   - Check Prisma schema syntax
   - Verify database connection string
   - Run `npx prisma generate` after schema changes
   - Check migration status with `npx prisma migrate status`

5. **Blitz.js Issues**
   - Run `blitz codegen` to regenerate types
   - Check query/mutation file structure
   - Verify import paths

6. **Middleware Issues**
   - Check middleware matcher configuration
   - Verify session cookie handling
   - Test protected vs public routes
   - Check redirect logic

### Development Tools

- **React Developer Tools** - Component inspection
- **Next.js DevTools** - Performance monitoring
- **Prisma Studio** - Database management GUI
- **Supabase Dashboard** - Database management
- **Browser DevTools** - Network and console debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Pull Request Guidelines

- Include a clear description of changes
- Add screenshots for UI changes
- Update documentation if needed
- Ensure all tests pass
- Follow the existing code style
- Update database schema if needed
- Add migrations for database changes 