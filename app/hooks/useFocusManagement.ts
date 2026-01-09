import { useEffect, type RefObject } from "react";

/**
 * Manages focus between open/close buttons when state changes
 */
export function useFocusManagement(
  isOpen: boolean,
  openButtonRef: RefObject<HTMLButtonElement | null>,
  closeButtonRef: RefObject<HTMLButtonElement | null>
) {
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    } else {
      openButtonRef.current?.focus();
    }
  }, [isOpen, openButtonRef, closeButtonRef]);
}
