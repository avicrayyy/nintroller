"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { Button } from "../Button";
import { IconButton } from "../IconButton";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footerButtonText?: string;
  ariaLabel?: string;
  onConfirm?: () => void;
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footerButtonText = "EXECUTE",
  ariaLabel,
  onConfirm,
}: Props) {
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
    // Focus management: put focus on the close button.
    closeButtonRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title}
      onMouseDown={(e) => {
        // Click outside closes (but only if the backdrop itself was clicked).
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-300/25 bg-black/70 text-emerald-50 shadow-[0_0_0_1px_rgba(16,185,129,0.15),_0_22px_50px_rgba(0,0,0,0.65)] backdrop-blur">
        <div className="flex items-start justify-between gap-4 p-5">
          <div className="flex-1">
            <div className="font-pixel text-[11px] text-emerald-200/80">
              {title}
            </div>
            <div className="mt-3 text-sm leading-relaxed text-emerald-100/90">
              {children}
            </div>
          </div>

          <IconButton
            ref={closeButtonRef}
            onClick={onClose}
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

        <div className="border-t border-white/10 bg-black/20 p-4">
          <Button
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            fullWidth
            variant="emerald"
          >
            {footerButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}

