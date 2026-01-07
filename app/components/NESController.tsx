"use client";

import { useCallback, useEffect, useState } from "react";

export type NESButton =
  | "up"
  | "down"
  | "left"
  | "right"
  | "select"
  | "start"
  | "b"
  | "a";

export type InputSource = "pointer" | "keyboard";

export type ButtonChangeEvent = {
  button: NESButton;
  pressed: boolean;
  source: InputSource;
};

const KEY_TO_BUTTON: Record<string, NESButton | undefined> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  KeyZ: "b",
  KeyX: "a",
  Enter: "start",
  ShiftLeft: "select",
  ShiftRight: "select",
};

function shouldIgnoreKeyEvent(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  const tag = t.tagName?.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    (t as HTMLElement).isContentEditable
  );
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function prettyButtonName(b: NESButton) {
  switch (b) {
    case "up":
      return "Up";
    case "down":
      return "Down";
    case "left":
      return "Left";
    case "right":
      return "Right";
    case "select":
      return "Select";
    case "start":
      return "Start";
    case "b":
      return "B";
    case "a":
      return "A";
  }
}

type Props = {
  className?: string;
  onButtonChange?: (e: ButtonChangeEvent) => void;
};

export function NESController({ className, onButtonChange }: Props) {
  const [pressed, setPressed] = useState<Set<NESButton>>(() => new Set());

  const setButtonPressed = useCallback(
    (button: NESButton, isPressed: boolean, source: InputSource) => {
      setPressed((prev) => {
        const next = new Set(prev);
        const had = next.has(button);
        if (isPressed) next.add(button);
        else next.delete(button);

        // Only emit when it actually changes.
        if (had !== isPressed)
          onButtonChange?.({ button, pressed: isPressed, source });
        return next;
      });
    },
    [onButtonChange]
  );

  // Keyboard support (global).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (shouldIgnoreKeyEvent(e)) return;
      const btn = KEY_TO_BUTTON[e.code] ?? KEY_TO_BUTTON[e.key];
      if (!btn) return;
      e.preventDefault();
      setButtonPressed(btn, true, "keyboard");
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (shouldIgnoreKeyEvent(e)) return;
      const btn = KEY_TO_BUTTON[e.code] ?? KEY_TO_BUTTON[e.key];
      if (!btn) return;
      e.preventDefault();
      setButtonPressed(btn, false, "keyboard");
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [setButtonPressed]);

  // Safety: release everything on blur.
  useEffect(() => {
    const onBlur = () => {
      setPressed((prev) => {
        if (prev.size === 0) return prev;
        const released = Array.from(prev);
        released.forEach((b) =>
          onButtonChange?.({ button: b, pressed: false, source: "keyboard" })
        );
        return new Set();
      });
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [onButtonChange]);

  const isDown = useCallback((b: NESButton) => pressed.has(b), [pressed]);

  const BaseButton = useCallback(
    ({
      button,
      className: btnClassName,
      children,
    }: {
      button: NESButton;
      className?: string;
      children?: ReactNode;
    }) => {
      const down = isDown(button);
      return (
        <button
          type="button"
          aria-label={prettyButtonName(button)}
          aria-pressed={down}
          className={cx(
            "select-none touch-none",
            "outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/60 dark:focus-visible:ring-zinc-100/70",
            btnClassName
          )}
          onPointerDown={(e) => {
            (e.currentTarget as HTMLButtonElement).setPointerCapture(
              e.pointerId
            );
            setButtonPressed(button, true, "pointer");
          }}
          onPointerUp={(e) => {
            (e.currentTarget as HTMLButtonElement).releasePointerCapture(
              e.pointerId
            );
            setButtonPressed(button, false, "pointer");
          }}
          onPointerCancel={() => setButtonPressed(button, false, "pointer")}
          onPointerLeave={() => setButtonPressed(button, false, "pointer")}
        >
          {children}
        </button>
      );
    },
    [isDown, setButtonPressed]
  );

  return (
    <div
      className={cx(
        "w-full max-w-3xl",
        "rounded-[28px] border border-black/10 bg-zinc-100 shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
        "dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]",
        "px-6 py-6 sm:px-10 sm:py-8",
        className
      )}
    >
      <div className="flex items-center justify-between gap-6">
        {/* D-Pad */}
        <div className="relative h-[150px] w-[150px] shrink-0">
          <div className="absolute inset-0 rounded-2xl bg-zinc-200/70 dark:bg-zinc-800/40" />
          <BaseButton
            button="up"
            className={cx(
              "absolute left-1/2 top-3 h-12 w-14 -translate-x-1/2 rounded-lg",
              "bg-zinc-950 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.12)]",
              "transition-transform",
              isDown("up") && "translate-y-[1px] -translate-x-1/2 shadow-none"
            )}
          />
          <BaseButton
            button="down"
            className={cx(
              "absolute left-1/2 bottom-3 h-12 w-14 -translate-x-1/2 rounded-lg",
              "bg-zinc-950 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.12)]",
              "transition-transform",
              isDown("down") && "translate-y-[1px] -translate-x-1/2 shadow-none"
            )}
          />
          <BaseButton
            button="left"
            className={cx(
              "absolute left-3 top-1/2 h-14 w-12 -translate-y-1/2 rounded-lg",
              "bg-zinc-950 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.12)]",
              "transition-transform",
              isDown("left") && "translate-y-[calc(-50%+1px)] shadow-none"
            )}
          />
          <BaseButton
            button="right"
            className={cx(
              "absolute right-3 top-1/2 h-14 w-12 -translate-y-1/2 rounded-lg",
              "bg-zinc-950 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.12)]",
              "transition-transform",
              isDown("right") && "translate-y-[calc(-50%+1px)] shadow-none"
            )}
          />
          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900 ring-2 ring-zinc-700/60 dark:ring-zinc-600/60" />
        </div>

        {/* Center: Select / Start */}
        <div className="flex grow flex-col items-center gap-4">
          <div className="text-xs font-semibold tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            NINTROLLER
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <BaseButton
                button="select"
                className={cx(
                  "h-8 w-16 rounded-full",
                  "bg-zinc-800 shadow-[inset_0_2px_0_rgba(255,255,255,0.10)]",
                  "transition-transform",
                  isDown("select") && "translate-y-[1px] shadow-none"
                )}
              />
              <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                SELECT
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BaseButton
                button="start"
                className={cx(
                  "h-8 w-16 rounded-full",
                  "bg-zinc-800 shadow-[inset_0_2px_0_rgba(255,255,255,0.10)]",
                  "transition-transform",
                  isDown("start") && "translate-y-[1px] shadow-none"
                )}
              />
              <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                START
              </div>
            </div>
          </div>
        </div>

        {/* A / B Buttons */}
        <div className="flex shrink-0 items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <BaseButton
              button="b"
              className={cx(
                "h-16 w-16 rounded-full",
                "bg-red-600 shadow-[inset_0_3px_0_rgba(255,255,255,0.20),_0_8px_18px_rgba(0,0,0,0.20)]",
                "transition-transform",
                isDown("b") && "translate-y-[2px] shadow-none"
              )}
            />
            <div className="text-sm font-bold tracking-wide text-zinc-600 dark:text-zinc-400">
              B
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <BaseButton
              button="a"
              className={cx(
                "h-16 w-16 rounded-full",
                "bg-red-600 shadow-[inset_0_3px_0_rgba(255,255,255,0.20),_0_8px_18px_rgba(0,0,0,0.20)]",
                "transition-transform",
                isDown("a") && "translate-y-[2px] shadow-none"
              )}
            />
            <div className="text-sm font-bold tracking-wide text-zinc-600 dark:text-zinc-400">
              A
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
