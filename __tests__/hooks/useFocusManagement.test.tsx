import { renderHook } from "@testing-library/react";
import { useFocusManagement } from "@/app/hooks/useFocusManagement";

describe("useFocusManagement", () => {
  test("focuses close button when open", () => {
    const closeButtonRef = { current: document.createElement("button") };
    const openButtonRef = { current: document.createElement("button") };
    const focusSpy = jest.spyOn(closeButtonRef.current, "focus");

    renderHook(() =>
      useFocusManagement(true, openButtonRef, closeButtonRef)
    );

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  test("focuses open button when closed", () => {
    const closeButtonRef = { current: document.createElement("button") };
    const openButtonRef = { current: document.createElement("button") };
    const focusSpy = jest.spyOn(openButtonRef.current, "focus");

    renderHook(() =>
      useFocusManagement(false, openButtonRef, closeButtonRef)
    );

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  test("handles null refs gracefully", () => {
    const closeButtonRef = { current: null };
    const openButtonRef = { current: null };

    // Should not throw
    expect(() => {
      renderHook(() =>
        useFocusManagement(true, openButtonRef, closeButtonRef)
      );
    }).not.toThrow();
  });

  test("updates focus when isOpen changes", () => {
    const closeButtonRef = { current: document.createElement("button") };
    const openButtonRef = { current: document.createElement("button") };
    const closeFocusSpy = jest.spyOn(closeButtonRef.current, "focus");
    const openFocusSpy = jest.spyOn(openButtonRef.current, "focus");

    const { rerender } = renderHook(
      ({ isOpen }) =>
        useFocusManagement(isOpen, openButtonRef, closeButtonRef),
      {
        initialProps: { isOpen: false },
      }
    );

    expect(openFocusSpy).toHaveBeenCalledTimes(1);
    expect(closeFocusSpy).not.toHaveBeenCalled();

    rerender({ isOpen: true });

    expect(closeFocusSpy).toHaveBeenCalledTimes(1);
    expect(openFocusSpy).toHaveBeenCalledTimes(1);
  });
});

