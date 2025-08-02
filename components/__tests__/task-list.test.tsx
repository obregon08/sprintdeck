import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TaskList } from '../task-list'

// Mock the hooks
vi.mock('@/hooks', () => ({
  useTasks: () => ({
    data: [
      {
        id: '1',
        title: 'Test Task 1',
        description: 'A test task',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: 'project-1',
        assigneeId: null,
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-01-15T10:30:00Z',
      },
      {
        id: '2',
        title: 'Test Task 2',
        description: 'Another test task',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        projectId: 'project-1',
        assigneeId: null,
        createdAt: '2025-01-15T11:00:00Z',
        updatedAt: '2025-01-15T11:00:00Z',
      },
    ],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useDeleteTask: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return Wrapper
}

describe('TaskList', () => {
  it('renders task list with tasks', () => {
    render(<TaskList projectId="project-1" />, { wrapper: createWrapper() })

    expect(screen.getByText('Tasks (2)')).toBeInTheDocument()
    expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    expect(screen.getByText('Test Task 2')).toBeInTheDocument()
    expect(screen.getByText('A test task')).toBeInTheDocument()
    expect(screen.getByText('Another test task')).toBeInTheDocument()
  })

  it('shows task status badges', () => {
    render(<TaskList projectId="project-1" />, { wrapper: createWrapper() })

    expect(screen.getByText('TODO')).toBeInTheDocument()
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument()
  })

  it('shows task priority badges', () => {
    render(<TaskList projectId="project-1" />, { wrapper: createWrapper() })

    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
  })

  it('shows edit and delete buttons for each task', () => {
    render(<TaskList projectId="project-1" />, { wrapper: createWrapper() })

    // Should have edit and delete buttons for each task (buttons have no text, just icons)
    const buttons = screen.getAllByRole('button')
    const editDeleteButtons = buttons.filter(button => 
      button.getAttribute('class')?.includes('hover:bg-accent')
    )

    expect(editDeleteButtons).toHaveLength(4) // 2 edit + 2 delete buttons
  })

  it('shows add task button', () => {
    render(<TaskList projectId="project-1" />, { wrapper: createWrapper() })

    const addButton = screen.getByRole('link', { name: /add task/i })
    expect(addButton).toBeInTheDocument()
    expect(addButton).toHaveAttribute('href', '/protected/projects/project-1/tasks/create')
  })

  it('shows task creation date', () => {
    render(<TaskList projectId="project-1" />, { wrapper: createWrapper() })

    // Check for the date text (there are multiple "Created" elements, one for each task)
    const createdElements = screen.getAllByText(/created/i)
    expect(createdElements).toHaveLength(2) // One for each task
  })

  it('shows task description when available', () => {
    render(<TaskList projectId="project-1" />, { wrapper: createWrapper() })

    expect(screen.getByText('A test task')).toBeInTheDocument()
    expect(screen.getByText('Another test task')).toBeInTheDocument()
  })
}) 