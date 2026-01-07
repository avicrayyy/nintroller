"use client";

import * as React from "react";

import { BaseButton } from "./BaseButton";
import { KEY_TO_BUTTON, shouldIgnoreKeyEvent } from "./keyboard";
import type { ButtonChangeEvent, InputSource, NESButton } from "./types";
import { cx } from "./utils";

type Props = {
  className?: string;
  onButtonChange?: (e: ButtonChangeEvent) => void;
};

export function NESController({ className, onButtonChange }: Props) {
  const [pressed, setPressed] = React.useState<Set<NESButton>>(() => new Set());
  const pressedRef = React.useRef<Set<NESButton>>(new Set());

  const setButtonPressed = React.useCallback(
    (button: NESButton, isPressed: boolean, source: InputSource) => {
      const next = new Set(pressedRef.current);
      const had = next.has(button);
      if (had === isPressed) return;

      if (isPressed) next.add(button);
      else next.delete(button);

      pressedRef.current = next;
      setPressed(next);
      onButtonChange?.({ button, pressed: isPressed, source });
    },
    [onButtonChange]
  );

  // Keyboard support (global).
  React.useEffect(() => {
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
  React.useEffect(() => {
    const onBlur = () => {
      const prev = pressedRef.current;
      if (prev.size === 0) return;

      const released = Array.from(prev);
      pressedRef.current = new Set();
      setPressed(new Set());
      released.forEach((b) =>
        onButtonChange?.({ button: b, pressed: false, source: "keyboard" })
      );
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [onButtonChange]);

  const isDown = React.useCallback((b: NESButton) => pressed.has(b), [pressed]);

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
            down={isDown("up")}
            className={cx(
              "absolute left-1/2 top-3 h-12 w-14 -translate-x-1/2 rounded-lg",
              "bg-zinc-950 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.12)]",
              "transition-transform",
              isDown("up") && "translate-y-[1px] -translate-x-1/2 shadow-none"
            )}
            onChange={(p) => setButtonPressed("up", p, "pointer")}
          />
          <BaseButton
            button="down"
            down={isDown("down")}
            className={cx(
              "absolute left-1/2 bottom-3 h-12 w-14 -translate-x-1/2 rounded-lg",
              "bg-zinc-950 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.12)]",
              "transition-transform",
              isDown("down") && "translate-y-[1px] -translate-x-1/2 shadow-none"
            )}
            onChange={(p) => setButtonPressed("down", p, "pointer")}
          />
          <BaseButton
            button="left"
            down={isDown("left")}
            className={cx(
              "absolute left-3 top-1/2 h-14 w-12 -translate-y-1/2 rounded-lg",
              "bg-zinc-950 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.12)]",
              "transition-transform",
              isDown("left") && "translate-y-[calc(-50%+1px)] shadow-none"
            )}
            onChange={(p) => setButtonPressed("left", p, "pointer")}
          />
          <BaseButton
            button="right"
            down={isDown("right")}
            className={cx(
              "absolute right-3 top-1/2 h-14 w-12 -translate-y-1/2 rounded-lg",
              "bg-zinc-950 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.12)]",
              "transition-transform",
              isDown("right") && "translate-y-[calc(-50%+1px)] shadow-none"
            )}
            onChange={(p) => setButtonPressed("right", p, "pointer")}
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
                down={isDown("select")}
                className={cx(
                  "h-8 w-16 rounded-full",
                  "bg-zinc-800 shadow-[inset_0_2px_0_rgba(255,255,255,0.10)]",
                  "transition-transform",
                  isDown("select") && "translate-y-[1px] shadow-none"
                )}
                onChange={(p) => setButtonPressed("select", p, "pointer")}
              />
              <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                SELECT
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BaseButton
                button="start"
                down={isDown("start")}
                className={cx(
                  "h-8 w-16 rounded-full",
                  "bg-zinc-800 shadow-[inset_0_2px_0_rgba(255,255,255,0.10)]",
                  "transition-transform",
                  isDown("start") && "translate-y-[1px] shadow-none"
                )}
                onChange={(p) => setButtonPressed("start", p, "pointer")}
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
              down={isDown("b")}
              className={cx(
                "h-16 w-16 rounded-full",
                "bg-red-600 shadow-[inset_0_3px_0_rgba(255,255,255,0.20),_0_8px_18px_rgba(0,0,0,0.20)]",
                "transition-transform",
                isDown("b") && "translate-y-[2px] shadow-none"
              )}
              onChange={(p) => setButtonPressed("b", p, "pointer")}
            />
            <div className="text-sm font-bold tracking-wide text-zinc-600 dark:text-zinc-400">
              B
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <BaseButton
              button="a"
              down={isDown("a")}
              className={cx(
                "h-16 w-16 rounded-full",
                "bg-red-600 shadow-[inset_0_3px_0_rgba(255,255,255,0.20),_0_8px_18px_rgba(0,0,0,0.20)]",
                "transition-transform",
                isDown("a") && "translate-y-[2px] shadow-none"
              )}
              onChange={(p) => setButtonPressed("a", p, "pointer")}
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


