import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InputLogProvider } from "@/app/components/InputLog";
import { ControllerPlayground } from "@/app/components/ControllerPlayground";

// Mock window.innerWidth
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
};

// No need to mock fetch - cheat detection is now client-side

describe("ControllerPlayground", () => {
  beforeEach(() => {
    mockInnerWidth(1024); // Desktop by default
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renders help FAB button", () => {
    render(
      <InputLogProvider>
        <ControllerPlayground />
      </InputLogProvider>
    );
    expect(screen.getByLabelText("Show help")).toBeInTheDocument();
  });

  test("renders reset FAB button", () => {
    render(
      <InputLogProvider>
        <ControllerPlayground />
      </InputLogProvider>
    );
    expect(screen.getByLabelText("Reset progress")).toBeInTheDocument();
  });

  test("help FAB opens welcome modal when clicked", async () => {
    const user = userEvent.setup();
    render(
      <InputLogProvider>
        <ControllerPlayground />
      </InputLogProvider>
    );

    // Click help FAB
    await user.click(screen.getByLabelText("Show help"));

    // Welcome modal should be visible
    expect(screen.getByText("WELCOME TO NINTROLLER")).toBeInTheDocument();
  });

  test("reset FAB opens reset modal when clicked", async () => {
    const user = userEvent.setup();
    render(
      <InputLogProvider>
        <ControllerPlayground />
      </InputLogProvider>
    );

    // Click reset FAB
    await user.click(screen.getByLabelText("Reset progress"));

    // Reset modal should be visible
    expect(screen.getByText("RESET PROGRESS")).toBeInTheDocument();
  });

  test("FABs position correctly when sidebars are open on desktop", async () => {
    mockInnerWidth(1024);
    render(
      <InputLogProvider>
        <ControllerPlayground />
      </InputLogProvider>
    );

    // Wait for useEffect to set sidebar state to open
    await waitFor(() => {
      const helpFAB = screen.getByLabelText("Show help");
      const resetFAB = screen.getByLabelText("Reset progress");

      // FABs should have classes indicating sidebars are open
      expect(helpFAB.className).toContain("lg:left-[376px]");
      expect(resetFAB.className).toContain("lg:right-[376px]");
    });
  });

  test("FABs update position when left sidebar toggles on desktop", async () => {
    mockInnerWidth(1024);
    render(
      <InputLogProvider>
        <ControllerPlayground />
      </InputLogProvider>
    );

    const helpFAB = screen.getByLabelText("Show help");

    // Wait for initial state (sidebars open)
    await waitFor(() => {
      expect(helpFAB.className).toContain("lg:left-[376px]");
    });

    // Dispatch event to close left sidebar
    await act(async () => {
      window.dispatchEvent(
        new CustomEvent("objectives-sidebar-toggled", {
          detail: { open: false },
        })
      );
    });

    // FAB should move to closed position
    await waitFor(() => {
      expect(helpFAB.className).toContain("lg:left-4");
      expect(helpFAB.className).not.toContain("lg:left-[376px]");
    });
  });

  test("FABs update position when right sidebar toggles on desktop", async () => {
    mockInnerWidth(1024);
    render(
      <InputLogProvider>
        <ControllerPlayground />
      </InputLogProvider>
    );

    const resetFAB = screen.getByLabelText("Reset progress");

    // Wait for initial state (sidebars open)
    await waitFor(() => {
      expect(resetFAB.className).toContain("lg:right-[376px]");
    });

    // Dispatch event to close right sidebar
    await act(async () => {
      window.dispatchEvent(
        new CustomEvent("input-log-sidebar-toggled", {
          detail: { open: false },
        })
      );
    });

    // FAB should move to closed position
    await waitFor(() => {
      expect(resetFAB.className).toContain("lg:right-4");
      expect(resetFAB.className).not.toContain("lg:right-[376px]");
    });
  });

  test("FABs stay in mobile position on mobile", () => {
    mockInnerWidth(375);
    render(
      <InputLogProvider>
        <ControllerPlayground />
      </InputLogProvider>
    );

    const helpFAB = screen.getByLabelText("Show help");
    const resetFAB = screen.getByLabelText("Reset progress");

    // FABs should have mobile positioning (left-4, right-4)
    expect(helpFAB.className).toContain("left-4");
    expect(resetFAB.className).toContain("right-4");
    // Should not have desktop positioning classes
    expect(helpFAB.className).not.toContain("lg:left-[376px]");
    expect(resetFAB.className).not.toContain("lg:right-[376px]");
  });

  test("initializes FAB position correctly on desktop", async () => {
    mockInnerWidth(1024);
    render(
      <InputLogProvider>
        <ControllerPlayground />
      </InputLogProvider>
    );

    const helpFAB = screen.getByLabelText("Show help");

    // Wait for initialization to complete
    await waitFor(() => {
      // After initialization, FAB should be in open position (sidebars open by default)
      expect(helpFAB.className).toContain("lg:left-[376px]");
    });
  });
});

