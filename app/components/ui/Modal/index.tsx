"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { CloseIcon } from "../../icons";
import { SHADOWS } from "@/app/utils/styles";
import { cx } from "@/app/utils";

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
  footerButtonText = "Lez Ge Tit",
  ariaLabel,
  onConfirm,
}: Props) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle mount/unmount with animation delay
  useEffect(() => {
    if (open) {
      setIsMounted(true);
      // Start with animation state false, then trigger enter animation after mount
      setIsAnimating(false);
      // Use double RAF to ensure DOM is ready before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      // Trigger exit animation
      setIsAnimating(false);
      // Remove from DOM after animation completes
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 200); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !isAnimating) return;
    // Focus management: put focus on the close button after animation starts
    closeButtonRef.current?.focus();
  }, [open, isAnimating]);

  if (!isMounted) return null;

  return (
    <div
      className={cx(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "transition-opacity duration-200",
        isAnimating ? "opacity-100" : "opacity-0"
      )}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title}
      onMouseDown={(e) => {
        // Click outside closes (but only if the backdrop itself was clicked).
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cx(
          "absolute inset-0 bg-black/70 backdrop-blur-[2px]",
          "transition-opacity duration-200",
          isAnimating ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        className={cx(
          "relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-300/25 bg-black/70 text-emerald-50",
          SHADOWS.modal,
          "backdrop-blur",
          "transition-all duration-200",
          isAnimating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        )}
      >
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
            <CloseIcon className="h-4 w-4" />
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
            aria-label={`${footerButtonText} ${title}`}
          >
            {footerButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}

