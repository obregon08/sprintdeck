# SprintDeck

A modern project management application built with Next.js, TypeScript, and Tailwind CSS.

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

Chromatic provides visual testing and component documentation hosting.

#### Setup

1. Get your Chromatic project token:
   - Sign up at [chromatic.com](https://www.chromatic.com/start)
   - Create a new project or connect to an existing one
   - Copy your project token from the project settings

2. Configure your project token:
   ```bash
   # Option 1: Set environment variable
   export CHROMATIC_PROJECT_TOKEN=your_token_here
   
   # Option 2: Update chromatic.json
   # Replace CHROMATIC_PROJECT_TOKEN with your actual token
   ```

3. Publish to Chromatic:
   ```bash
   npm run chromatic
   ```

#### Automated Publishing

The project includes GitHub Actions for automated Chromatic publishing. To enable:

1. Add your Chromatic project token as a GitHub secret:
   - Go to your repository settings
   - Navigate to Secrets and variables > Actions
   - Add a new secret named `CHROMATIC_PROJECT_TOKEN`
   - Set the value to your Chromatic project token

2. Push to main or create a pull request to trigger the workflow

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Visual Testing

```bash
npm run chromatic
```

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

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.
