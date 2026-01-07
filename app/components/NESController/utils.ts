import type { NESButton } from "./types";

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


