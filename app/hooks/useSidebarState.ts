import { useEffect, useState } from "react";

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
      // Dispatch initial state so other components can sync
      window.dispatchEvent(
        new CustomEvent(toggleEvent, {
          detail: { open: true },
        })
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
      window.dispatchEvent(new CustomEvent(openEvent, { detail: {} }));
    } else {
      // Toggle on desktop
      setOpen((prev) => {
        const next = !prev;
        // Dispatch event after state update completes (defer to avoid render errors)
        queueMicrotask(() => {
          window.dispatchEvent(
            new CustomEvent(toggleEvent, {
              detail: { open: next },
            })
          );
        });
        return next;
      });
    }
  };

  return { open, setOpen, toggle };
}
