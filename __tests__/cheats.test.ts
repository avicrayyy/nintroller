import { detectCheat } from "@/app/libs/cheats";

describe("cheat detection", () => {
  test("detects Konami Code when the sequence is entered", () => {
    const seq = [
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
    ] as const;

    expect(detectCheat([...seq])?.id).toBe("konami");
  });

  test("detects ABBA when the sequence is entered", () => {
    const seq = ["a", "b", "b", "a"] as const;
    expect(detectCheat([...seq])?.id).toBe("abba");
  });

  test("does not detect when the suffix does not match", () => {
    const seq = ["up", "up", "down", "down", "left", "right"] as const;
    expect(detectCheat([...seq])).toBeNull();
  });
});
