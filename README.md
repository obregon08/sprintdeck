# SprintDeck

A modern project management application built with Next.js, TypeScript, and Tailwind CSS.

## Product Demo

https://www.loom.com/share/b24ee783691c4b898fffdfee628dbaf9?sid=1328c03a-dbb6-49fd-a805-71ba22fa4beb

## Features

- **Project Management**: Create, edit, and organize projects
- **Task Management**: Track tasks with drag-and-drop functionality
- **User Authentication**: Secure authentication with Supabase
- **Real-time Updates**: Live updates with React Query
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Query (TanStack Query)
- **Testing**: Vitest, React Testing Library, Playwright
- **Component Documentation**: Storybook with Chromatic

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sprintdeck
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

4. Set up the database:
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:ui` - Run tests with UI
- `npm run storybook` - Start Storybook
- `npm run build-storybook` - Build Storybook
- `npm run chromatic` - Publish to Chromatic

## Component Documentation

This project uses Storybook for component documentation and Chromatic for visual testing.

### Storybook

Start the Storybook development server:
```bash
npm run storybook
```

Build Storybook for production:
```bash
npm run build-storybook
```

### Chromatic (Visual Testing)

Chromatic provides visual testing and component documentation hosting. See the [Storybook documentation](docs/storybook.md#chromatic-integration) for detailed setup and configuration instructions.

```bash
npm run chromatic
```

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

E2E tests with Playwright are planned but not yet implemented. See the [roadmap](docs/roadmap.md) for more details.

### Visual Testing

```bash
npm run chromatic
```

See the [Storybook documentation](docs/storybook.md#chromatic-integration) for detailed setup and configuration instructions.

## Project Structure

```
sprintdeck/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── ui/             # UI components
│   └── __tests__/      # Component tests
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── services/           # API services
├── types/              # TypeScript type definitions
├── docs/               # Documentation
└── .storybook/         # Storybook configuration
```

## Contributing

This is a private repository. To contribute:

1. Create a new branch from `main` for your changes.
2. Make your changes and commit them to your branch.
3. Add or update tests as needed.
4. Run the test suite to ensure all tests pass.
5. Open a pull request targeting the `main` branch.
6. Your changes will be reviewed before being merged.

If you have questions about the contribution process, please reach out to the project maintainers.
