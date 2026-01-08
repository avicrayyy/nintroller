import { cx, getOrCreateSessionId, prettyButtonName } from "@/app/utils";

describe("cx utility", () => {
  test("filters out falsy values", () => {
    expect(cx("a", false, "b", null, "c", undefined)).toBe("a b c");
  });

  test("handles empty input", () => {
    expect(cx()).toBe("");
  });

  test("handles all truthy values", () => {
    expect(cx("a", "b", "c")).toBe("a b c");
  });

  test("handles only falsy values", () => {
    expect(cx(false, null, undefined)).toBe("");
  });
});

describe("prettyButtonName", () => {
  test("formats all button names correctly", () => {
    expect(prettyButtonName("up")).toBe("Up");
    expect(prettyButtonName("down")).toBe("Down");
    expect(prettyButtonName("left")).toBe("Left");
    expect(prettyButtonName("right")).toBe("Right");
    expect(prettyButtonName("select")).toBe("Select");
    expect(prettyButtonName("start")).toBe("Start");
    expect(prettyButtonName("b")).toBe("B");
    expect(prettyButtonName("a")).toBe("A");
  });
});

describe("getOrCreateSessionId", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  test("generates new session ID when none exists", () => {
    const id = getOrCreateSessionId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  test("returns existing session ID from localStorage", () => {
    if (typeof window === "undefined") return;
    localStorage.setItem("nintroller_session_id", "test-session-123");
    expect(getOrCreateSessionId()).toBe("test-session-123");
  });

  test("persists session ID in localStorage", () => {
    if (typeof window === "undefined") return;
    const id = getOrCreateSessionId();
    expect(localStorage.getItem("nintroller_session_id")).toBe(id);
  });
});

