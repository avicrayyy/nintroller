import { renderHook } from "@testing-library/react";
import { useEscapeKey } from "@/app/hooks/useEscapeKey";

describe("useEscapeKey", () => {
  let onClose: jest.Mock;

  beforeEach(() => {
    onClose = jest.fn();
    window.removeEventListener = jest.fn();
    window.addEventListener = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("does not add listener when not open", () => {
    renderHook(() => useEscapeKey(false, onClose));

    expect(window.addEventListener).not.toHaveBeenCalled();
  });

  test("adds keydown listener when open", () => {
    renderHook(() => useEscapeKey(true, onClose));

    expect(window.addEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  test("calls onClose when Escape key is pressed", () => {
    renderHook(() => useEscapeKey(true, onClose));

    const addEventListenerCall = (window.addEventListener as jest.Mock)
      .mock.calls[0];
    const handler = addEventListenerCall[1];

    // Simulate Escape key press
    const event = new KeyboardEvent("keydown", { key: "Escape" });
    handler(event);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("does not call onClose for other keys", () => {
    renderHook(() => useEscapeKey(true, onClose));

    const addEventListenerCall = (window.addEventListener as jest.Mock)
      .mock.calls[0];
    const handler = addEventListenerCall[1];

    // Simulate other key press
    const event = new KeyboardEvent("keydown", { key: "Enter" });
    handler(event);

    expect(onClose).not.toHaveBeenCalled();
  });

  test("removes listener when component unmounts", () => {
    const { unmount } = renderHook(() => useEscapeKey(true, onClose));

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  test("removes and re-adds listener when isOpen changes", () => {
    const { rerender } = renderHook(
      ({ isOpen }) => useEscapeKey(isOpen, onClose),
      {
        initialProps: { isOpen: true },
      }
    );

    expect(window.addEventListener).toHaveBeenCalledTimes(1);

    rerender({ isOpen: false });

    expect(window.removeEventListener).toHaveBeenCalledTimes(1);
    expect(window.addEventListener).toHaveBeenCalledTimes(1);

    rerender({ isOpen: true });

    expect(window.addEventListener).toHaveBeenCalledTimes(2);
  });
});

