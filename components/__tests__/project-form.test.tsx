import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProjectForm } from '../project-form'

// Mock the hooks
vi.mock('@/hooks', () => ({
  useCreateProject: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useUpdateProject: () => ({
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
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('ProjectForm', () => {
  it('should render create form by default', () => {
    render(<ProjectForm />, { wrapper: createWrapper() })

    expect(screen.getByText('Create New Project')).toBeInTheDocument()
    expect(screen.getByLabelText('Project Name *')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Project' })).toBeInTheDocument()
  })

  it('should render edit form when mode is edit', () => {
    const initialData = {
      id: '1',
      name: 'Test Project',
      description: 'Test description',
    }

    render(<ProjectForm mode="edit" initialData={initialData} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('Edit Project')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update Project' })).toBeInTheDocument()
  })

  it('should show validation error for empty project name', async () => {
    const user = userEvent.setup()
    render(<ProjectForm />, { wrapper: createWrapper() })

    const submitButton = screen.getByRole('button', { name: 'Create Project' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Project name is required')).toBeInTheDocument()
    })
  })

  it('should allow valid form submission', async () => {
    const user = userEvent.setup()
    render(<ProjectForm />, { wrapper: createWrapper() })

    const nameInput = screen.getByLabelText('Project Name *')
    const descriptionInput = screen.getByLabelText('Description')
    const submitButton = screen.getByRole('button', { name: 'Create Project' })

    await user.type(nameInput, 'New Project')
    await user.type(descriptionInput, 'Project description')
    await user.click(submitButton)

    // Form should be valid and not show errors
    expect(screen.queryByText('Project name is required')).not.toBeInTheDocument()
  })

  it('should show back link', () => {
    render(<ProjectForm />, { wrapper: createWrapper() })

    const backLink = screen.getByRole('link', { name: /back to projects/i })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/protected/projects')
  })
}) 