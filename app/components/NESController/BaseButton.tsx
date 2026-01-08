import { useRef } from "react";
import type { ReactNode } from "react";

import type { NESButton } from "@/app/types/nes-controller";
import { cx, prettyButtonName } from "@/app/utils";

type Props = {
  button: NESButton;
  down: boolean;
  className?: string;
  children?: ReactNode;
  onChange: (pressed: boolean) => void;
};

export function BaseButton({
  button,
  down,
  className,
  children,
  onChange,
}: Props) {
  const capturedPointerId = useRef<number | null>(null);

  return (
    <button
      type="button"
      aria-label={prettyButtonName(button)}
      aria-pressed={down}
      className={cx(
        "cursor-pointer select-none touch-none",
        "outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/60 dark:focus-visible:ring-zinc-100/70",
        className
      )}
      onPointerDown={(e) => {
        const button = e.currentTarget as HTMLButtonElement;
        button.setPointerCapture(e.pointerId);
        capturedPointerId.current = e.pointerId;
        onChange(true);
      }}
      onPointerUp={(e) => {
        const button = e.currentTarget as HTMLButtonElement;
        button.releasePointerCapture(e.pointerId);
        capturedPointerId.current = null;
        onChange(false);
      }}
      onPointerCancel={(e) => {
        const button = e.currentTarget as HTMLButtonElement;
        button.releasePointerCapture(e.pointerId);
        capturedPointerId.current = null;
        onChange(false);
      }}
      onPointerLeave={() => {
        // Only release if we don't have pointer capture active
        // (pointer capture means the pointer is still "ours" even if it leaves visually)
        if (capturedPointerId.current === null) {
          onChange(false);
        }
      }}
    >
      {children}
    </button>
  );
}


