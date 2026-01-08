"use client";

import { forwardRef, type ReactNode } from "react";

import { cx } from "@/app/utils";

type Props = {
  onClick: () => void;
  "aria-label": string;
  children: ReactNode;
  className?: string;
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  ({ onClick, "aria-label": ariaLabel, children, className = "" }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cx(
          "shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10 transition-colors",
          className
        )}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

