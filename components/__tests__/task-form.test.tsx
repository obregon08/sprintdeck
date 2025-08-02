import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TaskForm } from '../task-form'

// Mock the hooks
vi.mock('@/hooks', () => ({
  useCreateTask: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useUpdateTask: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

// Mock the router
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
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

describe('TaskForm', () => {
  it('renders create form by default', () => {
    render(<TaskForm projectId="project-1" />, { wrapper: createWrapper() })

    expect(screen.getByText('Create New Task')).toBeInTheDocument()
    expect(screen.getByLabelText('Task Title *')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Priority')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Task' })).toBeInTheDocument()
  })

  it('renders edit form when mode is edit', () => {
    const initialData = {
      id: '1',
      title: 'Test Task',
      description: 'Test description',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      assigneeId: null,
    }

    render(<TaskForm mode="edit" projectId="project-1" initialData={initialData} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('Edit Task')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update Task' })).toBeInTheDocument()
  })

  it('shows validation error for empty task title', async () => {
    const user = userEvent.setup()
    render(<TaskForm projectId="project-1" />, { wrapper: createWrapper() })

    const submitButton = screen.getByRole('button', { name: 'Create Task' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Task title is required')).toBeInTheDocument()
    })
  })

  it('allows valid form submission', async () => {
    const user = userEvent.setup()
    render(<TaskForm projectId="project-1" />, { wrapper: createWrapper() })

    const titleInput = screen.getByLabelText('Task Title *')
    const descriptionInput = screen.getByLabelText('Description')
    const submitButton = screen.getByRole('button', { name: 'Create Task' })

    await user.type(titleInput, 'New Task')
    await user.type(descriptionInput, 'Task description')
    await user.click(submitButton)

    // Form should be valid and not show errors
    expect(screen.queryByText('Task title is required')).not.toBeInTheDocument()
  })

  it('shows back link to project', () => {
    render(<TaskForm projectId="project-1" />, { wrapper: createWrapper() })

    const backLink = screen.getByRole('link', { name: /back to project/i })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/protected/projects/project-1')
  })

  it('shows cancel button that redirects to project', async () => {
    const user = userEvent.setup()
    render(<TaskForm projectId="project-1" />, { wrapper: createWrapper() })

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)

    expect(mockPush).toHaveBeenCalledWith('/protected/projects/project-1')
  })

  it('has proper form labels and placeholders', () => {
    render(<TaskForm projectId="project-1" />, { wrapper: createWrapper() })

    expect(screen.getByLabelText('Task Title *')).toHaveAttribute('placeholder', 'Enter task title')
    expect(screen.getByLabelText('Description')).toHaveAttribute('placeholder', 'Enter task description (optional)')
  })

  it('shows status and priority dropdowns', () => {
    render(<TaskForm projectId="project-1" />, { wrapper: createWrapper() })

    // Check that status dropdown is present
    expect(screen.getByText('Status')).toBeInTheDocument()
    
    // Check that priority dropdown is present
    expect(screen.getByText('Priority')).toBeInTheDocument()
  })
}) 