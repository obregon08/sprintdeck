import { render, screen } from "@testing-library/react";
import { TaskSwimlane } from "../task-swimlane";
import { QueryProvider } from "../query-provider";
import { TaskFilterProvider } from "@/contexts/task-filter-context";
import * as hooks from "@/hooks";
import { vi } from "vitest";

// Mock the hooks
vi.mock("@/hooks", () => ({
  useTasks: vi.fn(),
  useDeleteTask: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useUpdateTaskStatus: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useMyProjectRole: vi.fn(() => ({
    data: { role: 'OWNER' },
    isLoading: false,
    error: null,
  })),
  useProjectAssignees: vi.fn(() => ({
    data: [
      { id: 'user-1', email: 'alice@example.com', name: 'Alice Johnson' },
      { id: 'user-2', email: 'bob@example.com', name: 'Bob Smith' },
    ],
    isLoading: false,
  })),
}));

const mockTasks = [
  {
    id: "1",
    title: "Test Task 1",
    description: "Test description 1",
    status: "TODO" as const,
    priority: "MEDIUM" as const,
    projectId: "project-1",
    assigneeId: "user-1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Test Task 2",
    description: "Test description 2",
    status: "IN_PROGRESS" as const,
    priority: "HIGH" as const,
    projectId: "project-1",
    assigneeId: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <QueryProvider>
      <TaskFilterProvider>
        {component}
      </TaskFilterProvider>
    </QueryProvider>
  );
};

describe("TaskSwimlane", () => {
  const mockUseTasks = vi.mocked(hooks.useTasks);
  const mockUseUpdateTaskStatus = vi.mocked(hooks.useUpdateTaskStatus);

  beforeEach(() => {
    mockUseTasks.mockReturnValue({
      data: mockTasks,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    mockUseUpdateTaskStatus.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  it("renders swimlanes with tasks", () => {
    renderWithProvider(<TaskSwimlane projectId="project-1" />);

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
  });

  it("shows assignee badge for assigned tasks", () => {
    renderWithProvider(<TaskSwimlane projectId="project-1" />);

    // Should show assignee for the first task
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    
    // Should not show assignee for the second task (unassigned)
    expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();
  });

  it("shows task counts in badges", () => {
    renderWithProvider(<TaskSwimlane projectId="project-1" />);

    // Should show count badges for each swimlane
    const badges = screen.getAllByText(/\d+/);
    expect(badges.length).toBeGreaterThan(0);
  });

  it("shows loading state", () => {
    mockUseTasks.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    renderWithProvider(<TaskSwimlane projectId="project-1" />);

    // Should show skeleton loading state with animated pulse elements
    const skeletonElements = screen.getAllByText(""); // Empty text elements are skeleton placeholders
    expect(skeletonElements.length).toBeGreaterThan(0);
    
    // Check for skeleton animation classes
    const pulseElements = document.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("shows error state", () => {
    mockUseTasks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to load"),
      refetch: vi.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    renderWithProvider(<TaskSwimlane projectId="project-1" />);

    expect(screen.getByText("Failed to load tasks")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("shows empty state when no tasks", () => {
    mockUseTasks.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    renderWithProvider(<TaskSwimlane projectId="project-1" />);

    expect(screen.getByText("No tasks found")).toBeInTheDocument();
    expect(screen.getByText("Create First Task")).toBeInTheDocument();
  });
}); 