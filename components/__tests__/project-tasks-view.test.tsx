import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectTasksView } from "../project-tasks-view";
import { QueryProvider } from "../query-provider";
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
}));

const mockTasks = [
  {
    id: "1",
    title: "Test Task 1",
    description: "Test description 1",
    status: "TODO" as const,
    priority: "MEDIUM" as const,
    projectId: "project-1",
    assigneeId: null,
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
  return render(<QueryProvider>{component}</QueryProvider>);
};

describe("ProjectTasksView", () => {
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

  it("renders tasks in list view by default", () => {
    renderWithProvider(<ProjectTasksView projectId="project-1" />);

    expect(screen.getByText("Tasks")).toBeInTheDocument();
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  it("switches to swimlane view when toggle is clicked", () => {
    renderWithProvider(<ProjectTasksView projectId="project-1" />);

    // Click the swimlane button
    fireEvent.click(screen.getByText("Swimlane"));

    // Should still show the tasks but in swimlane format
    expect(screen.getByText("Tasks")).toBeInTheDocument();
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockUseTasks.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    renderWithProvider(<ProjectTasksView projectId="project-1" />);

    expect(screen.getByText("Tasks")).toBeInTheDocument();
    // Should show skeleton loading state
    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUseTasks.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to load"),
      refetch: vi.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    renderWithProvider(<ProjectTasksView projectId="project-1" />);

    expect(screen.getByText("Failed to load tasks")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });
}); 