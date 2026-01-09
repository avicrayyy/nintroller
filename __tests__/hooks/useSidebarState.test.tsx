import { renderHook, act, waitFor } from "@testing-library/react";
import { useSidebarState } from "@/app/hooks/useSidebarState";
import {
  EVENT_NAMES,
  createSidebarOpenedEvent,
} from "@/app/utils/events";

// Mock window.innerWidth
const originalInnerWidth = window.innerWidth;

describe("useSidebarState", () => {
  let dispatchEventSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    // Spy on dispatchEvent but keep real implementation
    dispatchEventSpy = jest.spyOn(window, "dispatchEvent");
  });

  afterEach(() => {
    jest.clearAllMocks();
    dispatchEventSpy.mockRestore();
  });

  test("initializes with closed state", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 800, // Mobile width
    });

    const { result } = renderHook(() =>
      useSidebarState({
        otherSidebarEvent: "other-opened",
        openEvent: "this-opened",
        toggleEvent: "this-toggled",
      })
    );

    expect(result.current.open).toBe(false);
  });

  test("opens by default on desktop after mount", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200, // Desktop width
    });

    const { result } = renderHook(() =>
      useSidebarState({
        otherSidebarEvent: "other-opened",
        openEvent: "this-opened",
        toggleEvent: EVENT_NAMES.OBJECTIVES_SIDEBAR_TOGGLED,
      })
    );

    await waitFor(() => {
      expect(result.current.open).toBe(true);
    });

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: EVENT_NAMES.OBJECTIVES_SIDEBAR_TOGGLED,
      })
    );
  });

  test("closes when other sidebar opens on mobile", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 800, // Mobile width
    });

    const { result } = renderHook(() =>
      useSidebarState({
        otherSidebarEvent: EVENT_NAMES.INPUT_LOG_SIDEBAR_OPENED,
        openEvent: "this-opened",
        toggleEvent: "this-toggled",
      })
    );

    // Open the sidebar first
    act(() => {
      result.current.setOpen(true);
    });

    expect(result.current.open).toBe(true);

    // Wait for effect to set up listener, then simulate other sidebar opening
    await waitFor(() => {
      expect(result.current.open).toBe(true);
    });

    act(() => {
      window.dispatchEvent(
        createSidebarOpenedEvent(EVENT_NAMES.INPUT_LOG_SIDEBAR_OPENED)
      );
    });

    await waitFor(() => {
      expect(result.current.open).toBe(false);
    });
  });

  test("does not close when other sidebar opens on desktop", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200, // Desktop width
    });

    const { result } = renderHook(() =>
      useSidebarState({
        otherSidebarEvent: "other-opened",
        openEvent: "this-opened",
        toggleEvent: "this-toggled",
      })
    );

    await waitFor(() => {
      expect(result.current.open).toBe(true);
    });

    // Simulate other sidebar opening
    act(() => {
      window.dispatchEvent(
        createSidebarOpenedEvent(
          EVENT_NAMES.INPUT_LOG_SIDEBAR_OPENED as
            | typeof EVENT_NAMES.OBJECTIVES_SIDEBAR_OPENED
            | typeof EVENT_NAMES.INPUT_LOG_SIDEBAR_OPENED
        )
      );
    });

    // Should still be open on desktop
    expect(result.current.open).toBe(true);
  });

  test("toggle opens sidebar on mobile and dispatches open event", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 800, // Mobile width
    });

    const { result } = renderHook(() =>
      useSidebarState({
        otherSidebarEvent: "other-opened",
        openEvent: EVENT_NAMES.OBJECTIVES_SIDEBAR_OPENED,
        toggleEvent: "this-toggled",
      })
    );

    act(() => {
      result.current.toggle();
    });

    expect(result.current.open).toBe(true);
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: EVENT_NAMES.OBJECTIVES_SIDEBAR_OPENED,
      })
    );
  });

  test("toggle toggles sidebar on desktop and dispatches toggle event", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200, // Desktop width
    });

    const { result } = renderHook(() =>
      useSidebarState({
        otherSidebarEvent: "other-opened",
        openEvent: "this-opened",
        toggleEvent: EVENT_NAMES.OBJECTIVES_SIDEBAR_TOGGLED,
      })
    );

    await waitFor(() => {
      expect(result.current.open).toBe(true);
    });

    // Toggle to close
    act(() => {
      result.current.toggle();
    });

    await waitFor(() => {
      expect(result.current.open).toBe(false);
    });

    // Should have dispatched toggle event
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: EVENT_NAMES.OBJECTIVES_SIDEBAR_TOGGLED,
      })
    );
  });

  test("setOpen allows direct state updates", () => {
    const { result } = renderHook(() =>
      useSidebarState({
        otherSidebarEvent: "other-opened",
        openEvent: "this-opened",
        toggleEvent: "this-toggled",
      })
    );

    act(() => {
      result.current.setOpen(true);
    });

    expect(result.current.open).toBe(true);

    act(() => {
      result.current.setOpen(false);
    });

    expect(result.current.open).toBe(false);
  });
});

