"use client";

import { useEffect, useRef } from "react";

type Cheat = { id: string; name: string };

type Props = {
  open: boolean;
  cheat: Cheat | null;
  onClose: () => void;
};

export function CheatModal({ open, cheat, onClose }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    // Basic focus management: put focus on the close button.
    closeButtonRef.current?.focus();
  }, [open]);

  if (!open || !cheat) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Cheat detected"
      onMouseDown={(e) => {
        // Click outside closes (but only if the backdrop itself was clicked).
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-300/25 bg-black/70 text-emerald-50 shadow-[0_0_0_1px_rgba(16,185,129,0.15),_0_22px_50px_rgba(0,0,0,0.65)] backdrop-blur">
        <div className="flex items-start justify-between gap-4 p-5">
          <div>
            <div className="font-pixel text-[11px] text-emerald-200/80">
              CHEAT UNLOCKED
            </div>
            <div className="mt-3 font-pixel text-base text-emerald-50">
              {cheat.name}
            </div>
            <div className="mt-2 font-mono text-sm text-emerald-100/80">
              Nice. Keep playing or try another code.
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-emerald-300/25 bg-emerald-400/10 px-3 py-2 font-mono text-sm font-semibold text-emerald-50 hover:bg-emerald-400/15"
          >
            Close
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-emerald-300/15 bg-black/30 p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-emerald-300 px-4 py-2 font-mono text-sm font-bold text-black hover:bg-emerald-200"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}


