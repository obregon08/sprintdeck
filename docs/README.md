# SprintDeck Documentation

This directory contains comprehensive documentation for the SprintDeck project management application.

## Documentation Overview

### Core Documentation

- **[Architecture](./architecture.md)** - Technical architecture, tech stack, and system design
- **[Development Guide](./development.md)** - Development setup, workflows, and best practices
- **[Setup Guide](./setup.md)** - Step-by-step installation and configuration instructions

### API Documentation

- **[API Examples](./api-examples.md)** - REST API endpoints and usage examples
- **[Tasks API](./tasks-api.md)** - Task management API documentation

### Feature Documentation

- **[Filter and Sort Features](./filter-sort-features.md)** - Advanced filtering and sorting functionality
- **[Swimlane View](./swimlane-view.md)** - Kanban-style task management with drag and drop

### Project Planning

- **[Roadmap](./roadmap.md)** - Current status and future development plans
- **[Deployment](./deployment.md)** - Deployment instructions and configuration

## Recent Documentation Updates

### Major Changes Made

1. **Removed Blitz.js References** - Updated all documentation to reflect the actual React Query + custom hooks implementation
2. **Updated Database Schema** - Added ProjectMember model and updated schema documentation
3. **Corrected Tech Stack** - Updated to reflect actual dependencies (Vitest instead of Jest, React Query instead of Blitz.js)
4. **Enhanced API Documentation** - Added project members support and status update endpoints
5. **Updated Testing Information** - Corrected testing setup to reflect Vitest usage
6. **Improved Roadmap** - Updated to reflect current completed features and realistic future plans

### Key Technical Corrections

- **State Management**: React Query (TanStack Query) instead of Blitz.js
- **Testing Framework**: Vitest with React Testing Library instead of Jest
- **Database Schema**: Added ProjectMember model with roles (OWNER, ADMIN, MEMBER)
- **API Structure**: REST APIs with React Query hooks instead of Blitz.js mutations
- **Project Structure**: Updated to reflect actual file organization

### Current Tech Stack (Corrected)

| Layer                | Technology                                    |
| -------------------- | --------------------------------------------- |
| **Frontend**         | Next.js 15 + React 19 + TypeScript           |
| **Styling**          | Tailwind CSS + shadcn/ui                     |
| **Backend**          | Supabase + Next.js API Routes                |
| **Database**         | PostgreSQL (via Supabase) + Prisma ORM       |
| **State Management** | React Query + React Context + useReducer     |
| **Testing**          | Vitest + React Testing Library + MSW         |
| **Authentication**   | Supabase Auth                                |

## Documentation Standards

### Writing Guidelines

1. **Accuracy First** - All documentation must reflect the actual codebase
2. **Code Examples** - Include working code examples that match the implementation
3. **Regular Updates** - Documentation should be updated when code changes
4. **Clear Structure** - Use consistent headings and formatting
5. **Practical Focus** - Focus on what developers need to know

### Maintenance

- Review documentation when making significant code changes
- Update API documentation when endpoints change
- Keep roadmap updated with current progress
- Test all code examples to ensure they work

## Contributing to Documentation

### How to Help

1. **Report Issues** - If you find outdated or incorrect information
2. **Suggest Improvements** - Propose better explanations or examples
3. **Add Missing Content** - Help fill gaps in documentation
4. **Update Examples** - Keep code examples current with the codebase

### Documentation Workflow

1. **Identify Need** - Find outdated or missing documentation
2. **Research** - Understand the current implementation
3. **Update** - Make the necessary changes
4. **Test** - Verify code examples work
5. **Review** - Have changes reviewed by the team

## Quick Reference

### Common Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint

# Testing
npm run test             # Run tests with Vitest
npm run test:watch       # Run tests in watch mode

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Create and apply migration
npm run db:studio        # Open Prisma Studio
```

### Key Files

- `prisma/schema.prisma` - Database schema
- `middleware.ts` - Authentication middleware
- `hooks/` - React Query hooks
- `services/` - API service functions
- `contexts/` - React Context providers

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_supabase_database_url
```

## Support

If you need help with the documentation or find any issues:

1. Check the existing documentation first
2. Look for similar issues in the repository
3. Create an issue with specific details about what's unclear or incorrect
4. Consider contributing a fix if you can

---

*Last updated: January 2025* 