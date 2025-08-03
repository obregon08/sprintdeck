import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProjectMembersModal } from '../project-members-modal'

// Mock the hooks
vi.mock('@/hooks/use-users', () => ({
  useProjectMembers: vi.fn(),
  useRemoveProjectMember: vi.fn(),
  useMyProjectRole: vi.fn(),
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

describe('ProjectMembersModal', () => {
  it('renders members button', async () => {
    const { useProjectMembers, useRemoveProjectMember, useMyProjectRole } = await import('@/hooks/use-users')
    vi.mocked(useProjectMembers).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any)
    
    vi.mocked(useRemoveProjectMember).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any)

    vi.mocked(useMyProjectRole).mockReturnValue({
      data: { role: 'MEMBER' },
      isLoading: false,
      error: null,
    } as any)

    render(<ProjectMembersModal projectId="project1" />, { wrapper: createWrapper() })

    expect(screen.getByRole('button', { name: /members/i })).toBeInTheDocument()
  })

  it('opens modal when button is clicked', async () => {
    const user = userEvent.setup()
    const { useProjectMembers, useRemoveProjectMember, useMyProjectRole } = await import('@/hooks/use-users')
    vi.mocked(useProjectMembers).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any)
    
    vi.mocked(useRemoveProjectMember).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any)

    vi.mocked(useMyProjectRole).mockReturnValue({
      data: { role: 'MEMBER' },
      isLoading: false,
      error: null,
    } as any)

    render(<ProjectMembersModal projectId="project1" />, { wrapper: createWrapper() })

    const button = screen.getByRole('button', { name: /members/i })
    await user.click(button)

    expect(screen.getByText('Project Members')).toBeInTheDocument()
  })

  it('shows remove button for non-owner members when user has permission', async () => {
    const user = userEvent.setup()
    const mockMembers = [
      { id: 'user1', name: 'User 1', email: 'user1@example.com', role: 'MEMBER' },
      { id: 'user2', name: 'User 2', email: 'user2@example.com', role: 'OWNER' },
    ]
    
    const { useProjectMembers, useRemoveProjectMember, useMyProjectRole } = await import('@/hooks/use-users')
    vi.mocked(useProjectMembers).mockReturnValue({
      data: mockMembers,
      isLoading: false,
      error: null,
    } as any)
    
    vi.mocked(useRemoveProjectMember).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any)

    vi.mocked(useMyProjectRole).mockReturnValue({
      data: { role: 'ADMIN' },
      isLoading: false,
      error: null,
    } as any)

    render(<ProjectMembersModal projectId="project1" />, { wrapper: createWrapper() })

    const button = screen.getByRole('button', { name: /members/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
      expect(screen.getByText('User 2')).toBeInTheDocument()
    })

    // Should show remove button for MEMBER but not for OWNER when user has ADMIN role
    const removeButtons = screen.getAllByRole('button', { name: '' })
    expect(removeButtons).toHaveLength(1) // Only one remove button for the MEMBER
  })

  it('opens confirmation dialog when remove button is clicked', async () => {
    const user = userEvent.setup()
    const mockMembers = [
      { id: 'user1', name: 'User 1', email: 'user1@example.com', role: 'MEMBER' },
    ]
    
    const { useProjectMembers, useRemoveProjectMember, useMyProjectRole } = await import('@/hooks/use-users')
    vi.mocked(useProjectMembers).mockReturnValue({
      data: mockMembers,
      isLoading: false,
      error: null,
    } as any)
    
    vi.mocked(useRemoveProjectMember).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any)

    vi.mocked(useMyProjectRole).mockReturnValue({
      data: { role: 'ADMIN' },
      isLoading: false,
      error: null,
    } as any)

    render(<ProjectMembersModal projectId="project1" />, { wrapper: createWrapper() })

    const button = screen.getByRole('button', { name: /members/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })

    // Click the remove button
    const removeButton = screen.getByRole('button', { name: '' })
    await user.click(removeButton)

    // Should show confirmation dialog
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Remove Member' })).toBeInTheDocument()
      expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument()
      expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument()
    })
  })

  it('does not show remove button when user does not have permission', async () => {
    const user = userEvent.setup()
    const mockMembers = [
      { id: 'user1', name: 'User 1', email: 'user1@example.com', role: 'MEMBER' },
      { id: 'user2', name: 'User 2', email: 'user2@example.com', role: 'ADMIN' },
    ]
    
    const { useProjectMembers, useRemoveProjectMember, useMyProjectRole } = await import('@/hooks/use-users')
    vi.mocked(useProjectMembers).mockReturnValue({
      data: mockMembers,
      isLoading: false,
      error: null,
    } as any)
    
    vi.mocked(useRemoveProjectMember).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any)

    vi.mocked(useMyProjectRole).mockReturnValue({
      data: { role: 'MEMBER' },
      isLoading: false,
      error: null,
    } as any)

    render(<ProjectMembersModal projectId="project1" />, { wrapper: createWrapper() })

    const button = screen.getByRole('button', { name: /members/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
      expect(screen.getByText('User 2')).toBeInTheDocument()
    })

    // Should not show any remove buttons when user has MEMBER role
    const removeButtons = screen.queryAllByRole('button', { name: '' })
    expect(removeButtons).toHaveLength(0) // No remove buttons for regular members
  })
}) 