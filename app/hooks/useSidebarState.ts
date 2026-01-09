import { useEffect, useState } from "react";
import {
  EVENT_NAMES,
  createSidebarToggleEvent,
  createSidebarOpenedEvent,
} from "@/app/utils/events";

type UseSidebarStateOptions = {
  /**
   * Event name to listen for when other sidebar opens on mobile
   */
  otherSidebarEvent: string;
  /**
   * Event name to dispatch when this sidebar opens on mobile
   */
  openEvent: string;
  /**
   * Event name to dispatch when sidebar toggles on desktop
   */
  toggleEvent: string;
};

export function useSidebarState({
  otherSidebarEvent,
  openEvent,
  toggleEvent,
}: UseSidebarStateOptions) {
  const [open, setOpen] = useState(false);

  // Open by default on desktop after mount (client-side hydration)
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setOpen(true);
      // Dispatch initial state so other components can sync
      window.dispatchEvent(
        createSidebarToggleEvent(
          toggleEvent as
            | typeof EVENT_NAMES.OBJECTIVES_SIDEBAR_TOGGLED
            | typeof EVENT_NAMES.INPUT_LOG_SIDEBAR_TOGGLED,
          true
        )
      );
    }
  }, [toggleEvent]);

  // Listen for other sidebar opening on mobile
  useEffect(() => {
    const handleOtherSidebarOpen = () => {
      if (window.innerWidth < 1024 && open) {
        setOpen(false);
      }
    };

    window.addEventListener(otherSidebarEvent, handleOtherSidebarOpen);
    return () => {
      window.removeEventListener(otherSidebarEvent, handleOtherSidebarOpen);
    };
  }, [open, otherSidebarEvent]);

  const toggle = () => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setOpen(true);
      // Notify other sidebar to close on mobile
      window.dispatchEvent(
        createSidebarOpenedEvent(
          openEvent as
            | typeof EVENT_NAMES.OBJECTIVES_SIDEBAR_OPENED
            | typeof EVENT_NAMES.INPUT_LOG_SIDEBAR_OPENED
        )
      );
    } else {
      // Toggle on desktop
      setOpen((prev) => {
        const next = !prev;
        // Dispatch event after state update completes (defer to avoid render errors)
        queueMicrotask(() => {
          window.dispatchEvent(
            createSidebarToggleEvent(
              toggleEvent as
                | typeof EVENT_NAMES.OBJECTIVES_SIDEBAR_TOGGLED
                | typeof EVENT_NAMES.INPUT_LOG_SIDEBAR_TOGGLED,
              next
            )
          );
        });
        return next;
      });
    }
  };

  return { open, setOpen, toggle };
}
