import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InputLogProvider } from "@/app/components/InputLog";
import { InputLogSidebar } from "@/app/components/InputLogSidebar";

// Mock window.innerWidth
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe("InputLogSidebar", () => {
  beforeEach(() => {
    // Reset to mobile width by default
    mockInnerWidth(375);
  });

  test("renders FAB button", () => {
    render(
      <InputLogProvider>
        <InputLogSidebar />
      </InputLogProvider>
    );
    expect(screen.getByLabelText("Open input log")).toBeInTheDocument();
  });

  test("FAB has LOG label", () => {
    render(
      <InputLogProvider>
        <InputLogSidebar />
      </InputLogProvider>
    );
    expect(screen.getByText("LOG")).toBeInTheDocument();
  });

  test("sidebar is closed by default on mobile", () => {
    mockInnerWidth(375);
    render(
      <InputLogProvider>
        <InputLogSidebar />
      </InputLogProvider>
    );
    // Sidebar content should not be visible
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("sidebar opens by default on desktop", async () => {
    mockInnerWidth(1024);
    render(
      <InputLogProvider>
        <InputLogSidebar />
      </InputLogProvider>
    );
    // Wait for useEffect to open the sidebar
    await waitFor(() => {
      expect(screen.getAllByText("INPUT LOG").length).toBeGreaterThan(0);
    });
  });

  test("opens modal sidebar when FAB is clicked on mobile", async () => {
    mockInnerWidth(375);
    const user = userEvent.setup();
    render(
      <InputLogProvider>
        <InputLogSidebar />
      </InputLogProvider>
    );

    // Click FAB
    await user.click(screen.getByLabelText("Open input log"));

    // Sidebar should be visible with modal overlay
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getAllByText("INPUT LOG").length).toBeGreaterThan(0);
  });

  test("closes sidebar when close button is clicked", async () => {
    mockInnerWidth(375);
    const user = userEvent.setup();
    render(
      <InputLogProvider>
        <InputLogSidebar />
      </InputLogProvider>
    );

    // Open sidebar
    await user.click(screen.getByLabelText("Open input log"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close sidebar
    await user.click(screen.getByLabelText("Close"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("closes sidebar on Escape key", async () => {
    mockInnerWidth(375);
    const user = userEvent.setup();
    render(
      <InputLogProvider>
        <InputLogSidebar />
      </InputLogProvider>
    );

    // Open sidebar
    await user.click(screen.getByLabelText("Open input log"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Press Escape
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("closes sidebar when clicking backdrop", async () => {
    mockInnerWidth(375);
    const user = userEvent.setup();
    render(
      <InputLogProvider>
        <InputLogSidebar />
      </InputLogProvider>
    );

    // Open sidebar
    await user.click(screen.getByLabelText("Open input log"));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // Click backdrop
    await user.click(dialog);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("toggles sidebar when FAB is clicked on desktop", async () => {
    mockInnerWidth(1024);
    const user = userEvent.setup();
    render(
      <InputLogProvider>
        <InputLogSidebar />
      </InputLogProvider>
    );

    // Wait for sidebar to open by default
    await waitFor(() => {
      expect(screen.getAllByText("INPUT LOG").length).toBeGreaterThan(0);
    });

    // Click FAB to toggle (should close)
    await user.click(screen.getByLabelText("Close input log"));

    // Sidebar should be hidden
    await waitFor(() => {
      // Desktop sidebar should be hidden (no dialog on desktop)
      const sidebar = document.querySelector('aside[class*="lg:block"]');
      expect(sidebar).toHaveClass("lg:hidden");
    });

    // Click FAB again to toggle (should open)
    await user.click(screen.getByLabelText("Open input log"));

    // Sidebar should be visible again
    await waitFor(() => {
      const sidebar = document.querySelector('aside[class*="lg:block"]');
      expect(sidebar).not.toHaveClass("lg:hidden");
    });
  });

  test("FAB dispatches toggle event on desktop", async () => {
    mockInnerWidth(1024);
    const user = userEvent.setup();
    const eventSpy = jest.fn();

    window.addEventListener("input-log-sidebar-toggled", eventSpy);

    render(
      <InputLogProvider>
        <InputLogSidebar />
      </InputLogProvider>
    );

    // Wait for initial state
    await waitFor(() => {
      expect(screen.getAllByText("INPUT LOG").length).toBeGreaterThan(0);
    });

    // Click FAB to toggle
    await user.click(screen.getByLabelText("Close input log"));

    // Should dispatch toggle event
    await waitFor(() => {
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { open: false },
        })
      );
    });

    window.removeEventListener("input-log-sidebar-toggled", eventSpy);
  });
});

