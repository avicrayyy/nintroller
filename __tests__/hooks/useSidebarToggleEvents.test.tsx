import { renderHook, act, waitFor } from "@testing-library/react";
import { useSidebarToggleEvents } from "@/app/hooks/useSidebarToggleEvents";
import {
  EVENT_NAMES,
  createSidebarToggleEvent,
} from "@/app/utils/events";

// Mock window.innerWidth
const originalInnerWidth = window.innerWidth;

describe("useSidebarToggleEvents", () => {
  beforeEach(() => {
    // Reset window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("initializes with closed state on mobile", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 800, // Mobile width
    });

    const { result } = renderHook(() => useSidebarToggleEvents());

    expect(result.current.leftSidebarOpen).toBe(false);
    expect(result.current.rightSidebarOpen).toBe(false);
  });

  test("initializes with open state on desktop", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200, // Desktop width
    });

    const { result } = renderHook(() => useSidebarToggleEvents());

    await waitFor(() => {
      expect(result.current.leftSidebarOpen).toBe(true);
      expect(result.current.rightSidebarOpen).toBe(true);
    });
  });

  test("updates leftSidebarOpen when objectives-sidebar-toggled event is dispatched on desktop", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200, // Desktop width
    });

    const { result } = renderHook(() => useSidebarToggleEvents());

    await waitFor(() => {
      expect(result.current.leftSidebarOpen).toBe(true);
    });

    // Toggle to close
    await act(async () => {
      window.dispatchEvent(
        createSidebarToggleEvent(EVENT_NAMES.OBJECTIVES_SIDEBAR_TOGGLED, false)
      );
      // Wait for queueMicrotask
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    await waitFor(() => {
      expect(result.current.leftSidebarOpen).toBe(false);
    });

    // Toggle to open
    await act(async () => {
      window.dispatchEvent(
        createSidebarToggleEvent(EVENT_NAMES.OBJECTIVES_SIDEBAR_TOGGLED, true)
      );
      // Wait for queueMicrotask
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    await waitFor(() => {
      expect(result.current.leftSidebarOpen).toBe(true);
    });
  });

  test("updates rightSidebarOpen when input-log-sidebar-toggled event is dispatched on desktop", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200, // Desktop width
    });

    const { result } = renderHook(() => useSidebarToggleEvents());

    await waitFor(() => {
      expect(result.current.rightSidebarOpen).toBe(true);
    });

    // Toggle to close
    await act(async () => {
      window.dispatchEvent(
        createSidebarToggleEvent(EVENT_NAMES.INPUT_LOG_SIDEBAR_TOGGLED, false)
      );
      // Wait for queueMicrotask
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    await waitFor(() => {
      expect(result.current.rightSidebarOpen).toBe(false);
    });

    // Toggle to open
    await act(async () => {
      window.dispatchEvent(
        createSidebarToggleEvent(EVENT_NAMES.INPUT_LOG_SIDEBAR_TOGGLED, true)
      );
      // Wait for queueMicrotask
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    await waitFor(() => {
      expect(result.current.rightSidebarOpen).toBe(true);
    });
  });

  test("ignores events on mobile", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 800, // Mobile width
    });

    const { result } = renderHook(() => useSidebarToggleEvents());

    expect(result.current.leftSidebarOpen).toBe(false);
    expect(result.current.rightSidebarOpen).toBe(false);

    // Dispatch events
    act(() => {
      window.dispatchEvent(
        createSidebarToggleEvent(EVENT_NAMES.OBJECTIVES_SIDEBAR_TOGGLED, true)
      );
      window.dispatchEvent(
        createSidebarToggleEvent(EVENT_NAMES.INPUT_LOG_SIDEBAR_TOGGLED, true)
      );
    });

    // Should remain false on mobile
    expect(result.current.leftSidebarOpen).toBe(false);
    expect(result.current.rightSidebarOpen).toBe(false);
  });

  test("ignores events before initialization on desktop", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200, // Desktop width
    });

    const { result } = renderHook(() => useSidebarToggleEvents());

    // Dispatch event immediately (before initialization completes)
    act(() => {
      window.dispatchEvent(
        createSidebarToggleEvent(EVENT_NAMES.OBJECTIVES_SIDEBAR_TOGGLED, false)
      );
    });

    // Should still initialize to true
    await waitFor(() => {
      expect(result.current.leftSidebarOpen).toBe(true);
    });
  });

  test("removes event listeners on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useSidebarToggleEvents());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      EVENT_NAMES.OBJECTIVES_SIDEBAR_TOGGLED,
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      EVENT_NAMES.INPUT_LOG_SIDEBAR_TOGGLED,
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });
});

