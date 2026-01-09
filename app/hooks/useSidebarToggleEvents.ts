import { useEffect, useRef, useState } from "react";
import { EVENT_NAMES, isTypedEvent, getEventDetail } from "@/app/utils/events";

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
      setLeftSidebarOpen(true);
      setRightSidebarOpen(true);
      hasInitializedRef.current = true;
    }

    const handleObjectivesToggle = (e: Event) => {
      if (
        isTypedEvent<{ open: boolean }>(
          e,
          EVENT_NAMES.OBJECTIVES_SIDEBAR_TOGGLED
        )
      ) {
        const detail = getEventDetail(e);
        if (window.innerWidth >= 1024 && hasInitializedRef.current) {
          queueMicrotask(() => {
            setLeftSidebarOpen(detail.open);
          });
        }
      }
    };

    const handleInputLogToggle = (e: Event) => {
      if (
        isTypedEvent<{ open: boolean }>(
          e,
          EVENT_NAMES.INPUT_LOG_SIDEBAR_TOGGLED
        )
      ) {
        const detail = getEventDetail(e);
        if (window.innerWidth >= 1024 && hasInitializedRef.current) {
          queueMicrotask(() => {
            setRightSidebarOpen(detail.open);
          });
        }
      }
    };

    window.addEventListener(
      EVENT_NAMES.OBJECTIVES_SIDEBAR_TOGGLED,
      handleObjectivesToggle
    );
    window.addEventListener(
      EVENT_NAMES.INPUT_LOG_SIDEBAR_TOGGLED,
      handleInputLogToggle
    );

    return () => {
      window.removeEventListener(
        EVENT_NAMES.OBJECTIVES_SIDEBAR_TOGGLED,
        handleObjectivesToggle
      );
      window.removeEventListener(
        EVENT_NAMES.INPUT_LOG_SIDEBAR_TOGGLED,
        handleInputLogToggle
      );
    };
  }, []);

  return { leftSidebarOpen, rightSidebarOpen };
}
