import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ObjectivesSidebar } from "@/app/components/ObjectivesSidebar";

// Mock window.innerWidth
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe("ObjectivesSidebar", () => {
  beforeEach(() => {
    // Reset to mobile width by default
    mockInnerWidth(375);
    // Clear localStorage
    localStorage.clear();
  });

  test("renders FAB button", () => {
    render(<ObjectivesSidebar />);
    expect(screen.getByLabelText("Open objectives")).toBeInTheDocument();
  });

  test("FAB has OBJ label", () => {
    render(<ObjectivesSidebar />);
    expect(screen.getByText("OBJ")).toBeInTheDocument();
  });

  test("sidebar is closed by default on mobile", () => {
    mockInnerWidth(375);
    render(<ObjectivesSidebar />);
    // Sidebar content should not be visible
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("sidebar opens by default on desktop", async () => {
    mockInnerWidth(1024);
    render(<ObjectivesSidebar />);
    // Wait for useEffect to open the sidebar
    await waitFor(() => {
      expect(screen.getAllByText("OBJECTIVES").length).toBeGreaterThan(0);
    });
  });

  test("opens modal sidebar when FAB is clicked on mobile", async () => {
    mockInnerWidth(375);
    const user = userEvent.setup();
    render(<ObjectivesSidebar />);

    // Click FAB
    await user.click(screen.getByLabelText("Open objectives"));

    // Sidebar should be visible with modal overlay
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getAllByText("OBJECTIVES").length).toBeGreaterThan(0);
  });

  test("closes sidebar when close button is clicked", async () => {
    mockInnerWidth(375);
    const user = userEvent.setup();
    render(<ObjectivesSidebar />);

    // Open sidebar
    await user.click(screen.getByLabelText("Open objectives"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close sidebar
    await user.click(screen.getByLabelText("Close"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("closes sidebar on Escape key", async () => {
    mockInnerWidth(375);
    const user = userEvent.setup();
    render(<ObjectivesSidebar />);

    // Open sidebar
    await user.click(screen.getByLabelText("Open objectives"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Press Escape
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("closes sidebar when clicking backdrop", async () => {
    mockInnerWidth(375);
    const user = userEvent.setup();
    render(<ObjectivesSidebar />);

    // Open sidebar
    await user.click(screen.getByLabelText("Open objectives"));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // Click backdrop
    await user.click(dialog);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("displays all cheats in objectives list", async () => {
    mockInnerWidth(375);
    const user = userEvent.setup();
    const { container } = render(<ObjectivesSidebar />);

    // Open sidebar
    await user.click(screen.getByLabelText("Open objectives"));

    // Should display all cheats (check container text content)
    expect(container.textContent).toContain("Konami Code");
    expect(container.textContent).toContain("ABBA");
    expect(container.textContent).toContain("Select + Start");
  });

  test("displays progress counter", async () => {
    mockInnerWidth(375);
    const user = userEvent.setup();
    const { container } = render(<ObjectivesSidebar />);

    // Open sidebar
    await user.click(screen.getByLabelText("Open objectives"));

    // Should show 0/3 initially
    expect(container.textContent).toContain("Progress: 0 / 3");
  });

  test("updates when cheat-unlocked event is dispatched", async () => {
    mockInnerWidth(375);
    const user = userEvent.setup();
    const { container } = render(<ObjectivesSidebar />);

    // Open sidebar
    await user.click(screen.getByLabelText("Open objectives"));

    // Dispatch cheat unlock event
    await act(async () => {
      window.dispatchEvent(
        new CustomEvent("cheat-unlocked", {
          detail: { cheat: { id: "abba", name: "ABBA" } },
        })
      );
    });

    // Wait for state update
    await waitFor(() => {
      expect(container.textContent).toContain("Progress: 1 / 3");
    });
  });

  test("resets progress when progress-reset event is dispatched", async () => {
    mockInnerWidth(375);
    const user = userEvent.setup();
    const { container } = render(<ObjectivesSidebar />);

    // Open sidebar
    await user.click(screen.getByLabelText("Open objectives"));

    // Unlock a cheat
    await act(async () => {
      window.dispatchEvent(
        new CustomEvent("cheat-unlocked", {
          detail: { cheat: { id: "abba", name: "ABBA" } },
        })
      );
    });

    await waitFor(() => {
      expect(container.textContent).toContain("Progress: 1 / 3");
    });

    // Reset progress
    await act(async () => {
      window.dispatchEvent(new CustomEvent("progress-reset", { detail: {} }));
    });

    await waitFor(() => {
      expect(container.textContent).toContain("Progress: 0 / 3");
    });
  });

  test("toggles sidebar when FAB is clicked on desktop", async () => {
    mockInnerWidth(1024);
    const user = userEvent.setup();
    render(<ObjectivesSidebar />);

    // Wait for sidebar to open by default
    await waitFor(() => {
      expect(screen.getAllByText("OBJECTIVES").length).toBeGreaterThan(0);
    });

    // Click FAB to toggle (should close)
    await user.click(screen.getByLabelText("Close objectives"));

    // Sidebar should be hidden
    await waitFor(() => {
      // Desktop sidebar should be hidden (no lg:block class when closed)
      const sidebar = document.querySelector("aside");
      expect(sidebar).toBeInTheDocument();
      expect(sidebar).not.toHaveClass("lg:block");
      expect(sidebar).toHaveClass("hidden");
    });

    // Click FAB again to toggle (should open)
    await user.click(screen.getByLabelText("Open objectives"));

    // Sidebar should be visible again
    await waitFor(() => {
      const sidebar = document.querySelector("aside");
      expect(sidebar).toBeInTheDocument();
      expect(sidebar).toHaveClass("lg:block");
    });
  });

  test("FAB dispatches toggle event on desktop", async () => {
    mockInnerWidth(1024);
    const user = userEvent.setup();
    const eventSpy = jest.fn();

    window.addEventListener("objectives-sidebar-toggled", eventSpy);

    render(<ObjectivesSidebar />);

    // Wait for initial state
    await waitFor(() => {
      expect(screen.getAllByText("OBJECTIVES").length).toBeGreaterThan(0);
    });

    // Click FAB to toggle
    await user.click(screen.getByLabelText("Close objectives"));

    // Should dispatch toggle event
    await waitFor(() => {
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { open: false },
        })
      );
    });

    window.removeEventListener("objectives-sidebar-toggled", eventSpy);
  });
});

