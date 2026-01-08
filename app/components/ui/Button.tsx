"use client";

import { forwardRef, type ReactNode } from "react";

import { cx } from "@/app/utils";

type Props = {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      onClick,
      children,
      className = "",
      variant = "primary",
      fullWidth = false,
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cx(
          "cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
          variant === "primary"
            ? "bg-white text-zinc-950 hover:bg-zinc-100"
            : "border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10",
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

