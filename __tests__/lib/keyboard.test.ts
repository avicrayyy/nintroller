import {
  KEY_TO_BUTTON,
  shouldIgnoreKeyEvent,
} from "@/app/components/NESController/keyboard";

describe("KEY_TO_BUTTON mapping", () => {
  test("maps all expected keys correctly", () => {
    expect(KEY_TO_BUTTON["ArrowUp"]).toBe("up");
    expect(KEY_TO_BUTTON["ArrowDown"]).toBe("down");
    expect(KEY_TO_BUTTON["ArrowLeft"]).toBe("left");
    expect(KEY_TO_BUTTON["ArrowRight"]).toBe("right");
    expect(KEY_TO_BUTTON["KeyZ"]).toBe("b");
    expect(KEY_TO_BUTTON["KeyX"]).toBe("a");
    expect(KEY_TO_BUTTON["Enter"]).toBe("start");
    expect(KEY_TO_BUTTON["ShiftLeft"]).toBe("select");
    expect(KEY_TO_BUTTON["ShiftRight"]).toBe("select");
  });

  test("returns undefined for unmapped keys", () => {
    expect(KEY_TO_BUTTON["Space"]).toBeUndefined();
    expect(KEY_TO_BUTTON["KeyA"]).toBeUndefined();
    expect(KEY_TO_BUTTON["Escape"]).toBeUndefined();
  });
});

describe("shouldIgnoreKeyEvent", () => {
  test("ignores events from input elements", () => {
    const input = document.createElement("input");
    const event = { target: input } as unknown as KeyboardEvent;
    expect(shouldIgnoreKeyEvent(event)).toBe(true);
  });

  test("ignores events from textarea elements", () => {
    const textarea = document.createElement("textarea");
    const event = { target: textarea } as unknown as KeyboardEvent;
    expect(shouldIgnoreKeyEvent(event)).toBe(true);
  });

  test("ignores events from contentEditable elements", () => {
    const div = document.createElement("div");
    div.contentEditable = "true";
    // Set isContentEditable property explicitly for test
    Object.defineProperty(div, "isContentEditable", {
      value: true,
      writable: false,
    });
    const event = { target: div } as unknown as KeyboardEvent;
    expect(shouldIgnoreKeyEvent(event)).toBe(true);
  });

  test("allows events from regular elements", () => {
    const div = document.createElement("div");
    // Ensure isContentEditable is false
    Object.defineProperty(div, "isContentEditable", {
      value: false,
      writable: false,
      configurable: true,
    });
    const event = { target: div } as unknown as KeyboardEvent;
    expect(shouldIgnoreKeyEvent(event)).toBe(false);
  });

  test("handles null target", () => {
    const event = { target: null } as unknown as KeyboardEvent;
    expect(shouldIgnoreKeyEvent(event)).toBe(false);
  });

  test("handles undefined target", () => {
    const event = {} as unknown as KeyboardEvent;
    expect(shouldIgnoreKeyEvent(event)).toBe(false);
  });
});
