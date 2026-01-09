"use client";

import { useRef } from "react";

import { InputLog } from "@/app/components/InputLog";
import { IconButton } from "@/app/components/ui/IconButton";
import { CloseIcon, LogIcon } from "@/app/components/icons";
import {
  useEscapeKey,
  useFocusManagement,
  useSidebarState,
} from "@/app/hooks";
import { cx } from "@/app/utils";

export function InputLogSidebar() {
  const openButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const { open, setOpen, toggle } = useSidebarState({
    otherSidebarEvent: "objectives-sidebar-opened",
    openEvent: "input-log-sidebar-opened",
    toggleEvent: "input-log-sidebar-toggled",
  });

  useEscapeKey(open, () => setOpen(false));
  useFocusManagement(open, openButtonRef, closeButtonRef);

  return (
    <>
      {/* FAB - visible on all screen sizes */}
      <IconButton
        ref={openButtonRef}
        onClick={toggle}
        aria-label={open ? "Close input log" : "Open input log"}
        variant="fab"
        label="LOG"
        className={cx(
          "fixed bottom-16 right-4 z-40 px-4 py-3",
          "lg:transition-all lg:duration-300",
          open ? "lg:right-[376px]" : "lg:right-4"
        )}
      >
        <LogIcon className="h-5 w-5" />
      </IconButton>

      {/* Mobile modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Input log"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
          <div className="absolute inset-0 border-l border-emerald-300/20 bg-black/80 shadow-2xl backdrop-blur">
            <div className="flex h-full flex-col p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-pixel text-[11px] text-emerald-200/80">
                    INPUT LOG
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-emerald-100/60">
                    View input history
                  </div>
                </div>
                <IconButton
                  ref={closeButtonRef}
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  variant="fab"
                  className="!rounded-full h-8 w-8 p-0"
                >
                  <CloseIcon className="h-4 w-4" />
                </IconButton>
              </div>

              <div className="mt-3 min-h-0 flex-1">
                <InputLog className="h-full" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop fixed right sidebar - always rendered, visibility controlled by parent layout */}
      <aside
        className={cx(
          "hidden lg:w-[360px] lg:border-l lg:border-emerald-300/20",
          "lg:bg-black/60 lg:pt-14 lg:backdrop-blur",
          open && "lg:block"
        )}
      >
        <div className="h-full px-6 pb-10">
          <InputLog className="h-full" />
        </div>
      </aside>
    </>
  );
}
