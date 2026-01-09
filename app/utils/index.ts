import type { NESButton } from "../types/nes-controller";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function prettyButtonName(b: NESButton) {
  switch (b) {
    case "up":
      return "Up";
    case "down":
      return "Down";
    case "left":
      return "Left";
    case "right":
      return "Right";
    case "select":
      return "Select";
    case "start":
      return "Start";
    case "b":
      return "B";
    case "a":
      return "A";
  }
}

const STORAGE_KEY = "nintroller_session_id";

/**
 * Generate or retrieve session ID from localStorage.
 * Session ID persists across page refreshes and is used for cheat detection tracking.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    // SSR fallback - will be replaced on client
    return "";
  }

  let sessionId = localStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    // Generate a new session ID
    sessionId =
      crypto.randomUUID?.() ||
      `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}

// Re-export event helpers
export * from "./events";

// Re-export style constants
export * from "./styles";
