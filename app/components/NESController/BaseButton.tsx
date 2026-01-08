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
  return (
    <button
      type="button"
      aria-label={prettyButtonName(button)}
      aria-pressed={down}
      className={cx(
        "select-none touch-none",
        "outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/60 dark:focus-visible:ring-zinc-100/70",
        className
      )}
      onPointerDown={(e) => {
        (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
        onChange(true);
      }}
      onPointerUp={(e) => {
        (e.currentTarget as HTMLButtonElement).releasePointerCapture(e.pointerId);
        onChange(false);
      }}
      onPointerCancel={() => onChange(false)}
      onPointerLeave={() => onChange(false)}
    >
      {children}
    </button>
  );
}


