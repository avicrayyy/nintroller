import {
  detectCheat,
  endsWithSequence,
  maxCheatLength,
} from "@/app/libs/cheats";

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

  test("detects Select + Start cheat", () => {
    const seq = ["select", "start"] as const;
    expect(detectCheat([...seq])?.id).toBe("select-start");
  });

  test("does not detect when the suffix does not match", () => {
    const seq = ["up", "up", "down", "down", "left", "right"] as const;
    expect(detectCheat([...seq])).toBeNull();
  });

  test("does not detect partial Konami Code", () => {
    expect(detectCheat(["up", "up", "down"])).toBeNull();
  });

  test("handles empty sequence", () => {
    expect(detectCheat([])).toBeNull();
  });
});

describe("maxCheatLength", () => {
  test("returns max sequence length", () => {
    expect(maxCheatLength()).toBe(11); // Konami Code
  });

  test("handles empty array", () => {
    expect(maxCheatLength([])).toBe(0);
  });

  test("returns correct max for custom cheats", () => {
    const customCheats = [
      { id: "short", name: "Short", sequence: ["a"] },
      { id: "long", name: "Long", sequence: ["a", "b", "c", "d", "e"] },
    ];
    expect(maxCheatLength(customCheats)).toBe(5);
  });
});

describe("endsWithSequence", () => {
  test("detects matching suffix", () => {
    expect(endsWithSequence(["a", "b", "b", "a"], ["b", "a"])).toBe(true);
  });

  test("rejects non-matching suffix", () => {
    expect(endsWithSequence(["a", "b", "b"], ["a", "a"])).toBe(false);
  });

  test("handles empty needle", () => {
    expect(endsWithSequence(["a", "b"], [])).toBe(true);
  });

  test("handles longer needle than haystack", () => {
    expect(endsWithSequence(["a"], ["a", "b"])).toBe(false);
  });

  test("detects exact match", () => {
    expect(endsWithSequence(["a", "b", "b", "a"], ["a", "b", "b", "a"])).toBe(
      true
    );
  });

  test("rejects when haystack is shorter", () => {
    expect(endsWithSequence(["a"], ["a", "b", "c"])).toBe(false);
  });

  test("handles empty haystack with empty needle", () => {
    expect(endsWithSequence([], [])).toBe(true);
  });

  test("handles empty haystack with non-empty needle", () => {
    expect(endsWithSequence([], ["a"])).toBe(false);
  });
});
