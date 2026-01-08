"use client";

import { useEffect, useRef, useState } from "react";

import { InputLog } from "@/app/components/InputLog";
import { IconButton } from "@/app/components/ui/IconButton";

export function InputLogSidebar() {
  const [open, setOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
    else openButtonRef.current?.focus();
  }, [open]);

  return (
    <>
      {/* Mobile FAB */}
      <IconButton
        ref={openButtonRef}
        onClick={() => setOpen(true)}
        aria-label="Open input log"
        variant="fab"
        label="LOG"
        className="fixed bottom-16 right-4 z-40 px-4 py-3 lg:hidden"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </IconButton>

      {/* Mobile modal-like sidebar */}
      {open ? (
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
          <div className="absolute inset-y-0 right-0 w-[min(360px,calc(100vw-48px))] border-l border-emerald-300/20 bg-black/80 shadow-2xl backdrop-blur">
            <div className="flex h-full flex-col p-4">
              <div className="flex items-center justify-between">
                <div className="font-pixel text-[11px] text-emerald-200/80">
                  INPUT LOG
                </div>
                <IconButton
                  ref={closeButtonRef}
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  variant="fab"
                  className="!rounded-full h-8 w-8 p-0"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </IconButton>
              </div>

              <div className="mt-3 min-h-0 flex-1">
                <InputLog className="h-full" />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Desktop fixed right sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:block lg:w-[360px] lg:border-l lg:border-emerald-300/20 lg:bg-black/60 lg:pt-14 lg:backdrop-blur">
        <div className="h-full px-6 pb-10">
          <InputLog className="h-full" />
        </div>
      </aside>
    </>
  );
}

