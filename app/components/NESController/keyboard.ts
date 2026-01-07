import type { NESButton } from "./types";

export const KEY_TO_BUTTON: Record<string, NESButton | undefined> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  KeyZ: "b",
  KeyX: "a",
  Enter: "start",
  ShiftLeft: "select",
  ShiftRight: "select",
};

export function shouldIgnoreKeyEvent(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  const tag = t.tagName?.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    (t as HTMLElement).isContentEditable
  );
}


