"use client";

import { forwardRef, type ReactNode } from "react";

import { cx } from "@/app/utils";

type Props = {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "emerald";
  fullWidth?: boolean;
  "aria-label"?: string;
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      onClick,
      children,
      className = "",
      variant = "primary",
      fullWidth = false,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={cx(
          "cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200",
          variant === "primary"
            ? "bg-white text-zinc-950 hover:bg-zinc-100 hover:shadow-lg hover:shadow-white/20"
            : variant === "emerald"
              ? "font-pixel bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/40"
              : "border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/15 hover:border-white/20 hover:shadow-lg hover:shadow-white/10",
          fullWidth && "w-full",
          className
        )}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

