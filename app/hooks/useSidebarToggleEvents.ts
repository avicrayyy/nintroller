import { useEffect, useRef, useState } from "react";

/**
 * Tracks sidebar open/close state by listening to toggle events
 * Used by ControllerPlayground to position FABs
 */
export function useSidebarToggleEvents() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Ensure state is correct on desktop (sidebars open by default)
    if (window.innerWidth >= 1024) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLeftSidebarOpen(true);
      setRightSidebarOpen(true);
      hasInitializedRef.current = true;
    }

    const handleObjectivesToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ open: boolean }>;
      if (window.innerWidth >= 1024 && hasInitializedRef.current) {
        queueMicrotask(() => {
          setLeftSidebarOpen(customEvent.detail.open);
        });
      }
    };

    const handleInputLogToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ open: boolean }>;
      if (window.innerWidth >= 1024 && hasInitializedRef.current) {
        queueMicrotask(() => {
          setRightSidebarOpen(customEvent.detail.open);
        });
      }
    };

    window.addEventListener("objectives-sidebar-toggled", handleObjectivesToggle);
    window.addEventListener("input-log-sidebar-toggled", handleInputLogToggle);

    return () => {
      window.removeEventListener("objectives-sidebar-toggled", handleObjectivesToggle);
      window.removeEventListener("input-log-sidebar-toggled", handleInputLogToggle);
    };
  }, []);

  return { leftSidebarOpen, rightSidebarOpen };
}

