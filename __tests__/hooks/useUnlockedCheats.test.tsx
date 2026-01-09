import { renderHook, act, waitFor } from "@testing-library/react";
import { useUnlockedCheats } from "@/app/hooks/useUnlockedCheats";
import {
  EVENT_NAMES,
  createCheatUnlockedEvent,
  createProgressResetEvent,
} from "@/app/utils/events";
import type { Cheat } from "@/app/libs/cheats";

const STORAGE_KEY = "nintroller:unlocked-cheats";

describe("useUnlockedCheats", () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("initializes with empty set", () => {
    const { result } = renderHook(() => useUnlockedCheats());

    expect(result.current).toEqual(new Set());
    expect(result.current.size).toBe(0);
  });

  test("hydrates from localStorage on mount", async () => {
    const storedCheats = ["konami", "abba"];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedCheats));

    const { result } = renderHook(() => useUnlockedCheats());

    await waitFor(() => {
      expect(result.current.size).toBe(2);
    });

    expect(result.current.has("konami")).toBe(true);
    expect(result.current.has("abba")).toBe(true);
  });

  test("handles invalid localStorage data gracefully", async () => {
    localStorage.setItem(STORAGE_KEY, "invalid json");

    const { result } = renderHook(() => useUnlockedCheats());

    await waitFor(() => {
      expect(result.current.size).toBe(0);
    });
  });

  test("adds cheat when cheat-unlocked event is dispatched", async () => {
    const { result } = renderHook(() => useUnlockedCheats());

    // Wait for effect to set up listener
    await waitFor(() => {
      expect(result.current.size).toBe(0);
    });

    const cheat: Cheat = {
      id: "konami",
      name: "Konami Code",
      sequence: ["up", "up", "down", "down"],
    };

    act(() => {
      window.dispatchEvent(createCheatUnlockedEvent(cheat));
    });

    await waitFor(() => {
      expect(result.current.has("konami")).toBe(true);
    });

    // Should be persisted to localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toContain("konami");
  });

  test("adds multiple cheats from multiple events", async () => {
    const { result } = renderHook(() => useUnlockedCheats());

    // Wait for effect to set up listener
    await waitFor(() => {
      expect(result.current.size).toBe(0);
    });

    const cheat1: Cheat = {
      id: "konami",
      name: "Konami Code",
      sequence: [],
    };
    const cheat2: Cheat = {
      id: "abba",
      name: "ABBA",
      sequence: [],
    };

    act(() => {
      window.dispatchEvent(createCheatUnlockedEvent(cheat1));
    });

    await waitFor(() => {
      expect(result.current.has("konami")).toBe(true);
    });

    act(() => {
      window.dispatchEvent(createCheatUnlockedEvent(cheat2));
    });

    await waitFor(() => {
      expect(result.current.has("abba")).toBe(true);
    });

    expect(result.current.size).toBe(2);
  });

  test("clears cheats when progress-reset event is dispatched", async () => {
    // Set up initial state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(["konami", "abba"]));

    const { result } = renderHook(() => useUnlockedCheats());

    await waitFor(() => {
      expect(result.current.size).toBe(2);
    });

    // Wait a bit for listener to be set up
    await new Promise((resolve) => setTimeout(resolve, 10));

    act(() => {
      window.dispatchEvent(createProgressResetEvent());
    });

    await waitFor(() => {
      expect(result.current.size).toBe(0);
    });

    // Should be cleared from localStorage
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  test("persists to localStorage when cheat is unlocked", async () => {
    const { result } = renderHook(() => useUnlockedCheats());

    // Wait for effect to set up listener
    await waitFor(() => {
      expect(result.current.size).toBe(0);
    });

    const cheat: Cheat = {
      id: "konami",
      name: "Konami Code",
      sequence: [],
    };

    act(() => {
      window.dispatchEvent(createCheatUnlockedEvent(cheat));
    });

    await waitFor(() => {
      expect(result.current.has("konami")).toBe(true);
    });

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toEqual(["konami"]);
  });

  test("removes event listeners on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useUnlockedCheats());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      EVENT_NAMES.CHEAT_UNLOCKED,
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      EVENT_NAMES.PROGRESS_RESET,
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });
});

