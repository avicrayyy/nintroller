"use client";

import { forwardRef, type ReactNode } from "react";

import { cx } from "@/app/utils";

type Props = {
  onClick: () => void;
  "aria-label": string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "fab";
  label?: string;
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      onClick,
      "aria-label": ariaLabel,
      children,
      className = "",
      variant = "default",
      label,
    },
    ref
  ) => {
    const baseStyles =
      variant === "fab"
        ? "font-pixel flex flex-col items-center justify-center gap-1 rounded-xl border border-emerald-300/25 bg-black/70 text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.10),_0_14px_30px_rgba(0,0,0,0.55)] backdrop-blur hover:bg-black/80 cursor-pointer"
        : "shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10 transition-colors cursor-pointer";

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cx(baseStyles, className)}
        aria-label={ariaLabel}
      >
        {children}
        {label && variant === "fab" && (
          <span className="text-[10px] leading-none">{label}</span>
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

