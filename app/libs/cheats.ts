import type { NESButton } from "../types/nes-controller";

export type Cheat = {
  id: string;
  name: string;
  // Sequence is based on button-down events (pressed=true) only.
  sequence: NESButton[];
};

export const CHEATS: Cheat[] = [
  {
    id: "konami",
    name: "Konami Code",
    sequence: [
      "up",
      "up",
      "down",
      "down",
      "left",
      "right",
      "left",
      "right",
      "b",
      "a",
      "start",
    ],
  },
  { id: "select-start", name: "Select + Start", sequence: ["select", "start"] },
  { id: "abba", name: "ABBA", sequence: ["a", "b", "b", "a"] },
];

export function maxCheatLength(cheats: Cheat[] = CHEATS) {
  return cheats.reduce((m, c) => Math.max(m, c.sequence.length), 0);
}

export function endsWithSequence(haystack: NESButton[], needle: NESButton[]) {
  if (needle.length === 0) return true;
  if (haystack.length < needle.length) return false;
  const start = haystack.length - needle.length;
  for (let i = 0; i < needle.length; i++) {
    if (haystack[start + i] !== needle[i]) return false;
  }
  return true;
}

export function detectCheat(
  pressedButtons: NESButton[],
  cheats: Cheat[] = CHEATS
) {
  for (const cheat of cheats) {
    if (endsWithSequence(pressedButtons, cheat.sequence)) return cheat;
  }
  return null;
}
