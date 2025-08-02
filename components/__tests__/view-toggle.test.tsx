import { render, screen, fireEvent } from "@testing-library/react";
import { ViewToggle } from "../view-toggle";

describe("ViewToggle", () => {
  const mockOnViewModeChange = vi.fn();

  beforeEach(() => {
    mockOnViewModeChange.mockClear();
  });

  it("renders both list and swimlane buttons", () => {
    render(
      <ViewToggle viewMode="list" onViewModeChange={mockOnViewModeChange} />
    );

    expect(screen.getByText("List")).toBeInTheDocument();
    expect(screen.getByText("Swimlane")).toBeInTheDocument();
  });

  it("highlights the active view mode", () => {
    render(
      <ViewToggle viewMode="list" onViewModeChange={mockOnViewModeChange} />
    );

    const listButton = screen.getByText("List").closest("button");
    const swimlaneButton = screen.getByText("Swimlane").closest("button");

    // Check that the active button has the default variant (which includes bg-primary)
    expect(listButton).toHaveClass("bg-primary");
    // Check that the inactive button has the ghost variant (no bg-primary)
    expect(swimlaneButton).not.toHaveClass("bg-primary");
  });

  it("calls onViewModeChange when buttons are clicked", () => {
    render(
      <ViewToggle viewMode="list" onViewModeChange={mockOnViewModeChange} />
    );

    fireEvent.click(screen.getByText("Swimlane"));
    expect(mockOnViewModeChange).toHaveBeenCalledWith("swimlane");

    fireEvent.click(screen.getByText("List"));
    expect(mockOnViewModeChange).toHaveBeenCalledWith("list");
  });
}); 