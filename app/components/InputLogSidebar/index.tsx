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
        className="fixed bottom-16 right-4 z-40 px-5 py-4 text-sm lg:hidden"
      >
        LOG
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
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-50 hover:bg-emerald-400/15"
                >
                  Close
                </button>
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

