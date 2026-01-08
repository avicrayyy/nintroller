"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ButtonChangeEvent, InputSource, NESButton } from "@/app/types/nes-controller";
import { cx } from "@/app/utils";

import { BaseButton } from "./BaseButton";
import { KEY_TO_BUTTON, shouldIgnoreKeyEvent } from "./keyboard";

type Props = {
  className?: string;
  onButtonChange?: (e: ButtonChangeEvent) => void;
};

export function NESController({ className, onButtonChange }: Props) {
  const [pressed, setPressed] = useState<Set<NESButton>>(() => new Set());
  const pressedRef = useRef<Set<NESButton>>(new Set());

  const setButtonPressed = useCallback(
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

  const isDown = useCallback((b: NESButton) => pressed.has(b), [pressed]);

  return (
    <div
      className={cx(
        "w-full max-w-3xl",
        "rounded-[28px] border border-emerald-300/20 bg-black/50 shadow-[0_0_0_1px_rgba(16,185,129,0.08),_0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur",
        "px-4 py-4 sm:px-10 sm:py-8",
        className
      )}
    >
      {/* Mobile emulator layout */}
      <div className="grid grid-cols-2 items-center gap-5 sm:hidden">
        {/* D-Pad */}
        <div className="relative h-[132px] w-[132px]">
          <div className="absolute inset-0 rounded-2xl bg-emerald-300/5 ring-1 ring-emerald-300/15" />
          <BaseButton
            button="up"
            down={isDown("up")}
            className={cx(
              "absolute left-1/2 top-2 h-10 w-12 -translate-x-1/2 rounded-lg",
              "bg-black text-emerald-50 shadow-[inset_0_2px_0_rgba(255,255,255,0.10)] ring-1 ring-emerald-300/15",
              "transition-transform",
              isDown("up") && "translate-y-[1px] -translate-x-1/2 shadow-none"
            )}
            onChange={(p) => setButtonPressed("up", p, "pointer")}
          />
          <BaseButton
            button="down"
            down={isDown("down")}
            className={cx(
              "absolute left-1/2 bottom-2 h-10 w-12 -translate-x-1/2 rounded-lg",
              "bg-black text-emerald-50 shadow-[inset_0_2px_0_rgba(255,255,255,0.10)] ring-1 ring-emerald-300/15",
              "transition-transform",
              isDown("down") && "translate-y-[1px] -translate-x-1/2 shadow-none"
            )}
            onChange={(p) => setButtonPressed("down", p, "pointer")}
          />
          <BaseButton
            button="left"
            down={isDown("left")}
            className={cx(
              "absolute left-2 top-1/2 h-12 w-10 -translate-y-1/2 rounded-lg",
              "bg-black text-emerald-50 shadow-[inset_0_2px_0_rgba(255,255,255,0.10)] ring-1 ring-emerald-300/15",
              "transition-transform",
              isDown("left") && "translate-y-[calc(-50%+1px)] shadow-none"
            )}
            onChange={(p) => setButtonPressed("left", p, "pointer")}
          />
          <BaseButton
            button="right"
            down={isDown("right")}
            className={cx(
              "absolute right-2 top-1/2 h-12 w-10 -translate-y-1/2 rounded-lg",
              "bg-black text-emerald-50 shadow-[inset_0_2px_0_rgba(255,255,255,0.10)] ring-1 ring-emerald-300/15",
              "transition-transform",
              isDown("right") && "translate-y-[calc(-50%+1px)] shadow-none"
            )}
            onChange={(p) => setButtonPressed("right", p, "pointer")}
          />
          <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black ring-2 ring-emerald-300/20" />
        </div>

        {/* A/B cluster (mobile: diagonal like emulator) */}
        <div className="relative h-[132px] w-[172px] justify-self-end">
          <div className="absolute inset-0 rounded-2xl bg-emerald-300/5 ring-1 ring-emerald-300/15" />

          <div className="absolute left-3 bottom-3 flex flex-col items-center gap-2">
            <BaseButton
              button="b"
              down={isDown("b")}
              className={cx(
                "h-14 w-14 rounded-full",
                "bg-rose-500/90 shadow-[inset_0_3px_0_rgba(255,255,255,0.18),_0_10px_20px_rgba(0,0,0,0.35)] ring-1 ring-white/10",
                "transition-transform",
                isDown("b") && "translate-y-[2px] shadow-none"
              )}
              onChange={(p) => setButtonPressed("b", p, "pointer")}
            />
            <div className="font-pixel text-[10px] text-emerald-100/70">B</div>
          </div>

          <div className="absolute right-3 top-3 flex flex-col items-center gap-2">
            <BaseButton
              button="a"
              down={isDown("a")}
              className={cx(
                "h-14 w-14 rounded-full",
                "bg-rose-500/90 shadow-[inset_0_3px_0_rgba(255,255,255,0.18),_0_10px_20px_rgba(0,0,0,0.35)] ring-1 ring-white/10",
                "transition-transform",
                isDown("a") && "translate-y-[2px] shadow-none"
              )}
              onChange={(p) => setButtonPressed("a", p, "pointer")}
            />
            <div className="font-pixel text-[10px] text-emerald-100/70">A</div>
          </div>
        </div>

        {/* Select / Start row (mobile: centered) */}
        <div className="col-span-2 flex items-center justify-center gap-7 pt-1">
          <div className="flex flex-col items-center gap-2">
            <BaseButton
              button="select"
              down={isDown("select")}
              className={cx(
                "h-8 w-20 rounded-full",
                "bg-black shadow-[inset_0_2px_0_rgba(255,255,255,0.10)] ring-1 ring-emerald-300/15",
                "transition-transform",
                isDown("select") && "translate-y-[1px] shadow-none"
              )}
              onChange={(p) => setButtonPressed("select", p, "pointer")}
            />
            <div className="font-pixel text-[10px] text-emerald-200/60">
              SELECT
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <BaseButton
              button="start"
              down={isDown("start")}
              className={cx(
                "h-8 w-20 rounded-full",
                "bg-black shadow-[inset_0_2px_0_rgba(255,255,255,0.10)] ring-1 ring-emerald-300/15",
                "transition-transform",
                isDown("start") && "translate-y-[1px] shadow-none"
              )}
              onChange={(p) => setButtonPressed("start", p, "pointer")}
            />
            <div className="font-pixel text-[10px] text-emerald-200/60">
              START
            </div>
          </div>
        </div>
      </div>

      {/* Desktop layout (keeps the classic row) */}
      <div className="hidden items-center justify-between gap-6 sm:flex">
        {/* D-Pad */}
        <div className="relative h-[150px] w-[150px] shrink-0">
          <div className="absolute inset-0 rounded-2xl bg-emerald-300/5 ring-1 ring-emerald-300/15" />
          <BaseButton
            button="up"
            down={isDown("up")}
            className={cx(
              "absolute left-1/2 top-3 h-12 w-14 -translate-x-1/2 rounded-lg",
              "bg-black text-emerald-50 shadow-[inset_0_2px_0_rgba(255,255,255,0.10)] ring-1 ring-emerald-300/15",
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
              "bg-black text-emerald-50 shadow-[inset_0_2px_0_rgba(255,255,255,0.10)] ring-1 ring-emerald-300/15",
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
              "bg-black text-emerald-50 shadow-[inset_0_2px_0_rgba(255,255,255,0.10)] ring-1 ring-emerald-300/15",
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
              "bg-black text-emerald-50 shadow-[inset_0_2px_0_rgba(255,255,255,0.10)] ring-1 ring-emerald-300/15",
              "transition-transform",
              isDown("right") && "translate-y-[calc(-50%+1px)] shadow-none"
            )}
            onChange={(p) => setButtonPressed("right", p, "pointer")}
          />
          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black ring-2 ring-emerald-300/20" />
        </div>

        {/* Center: Select / Start */}
        <div className="flex grow flex-col items-center gap-4">
          <div className="font-pixel text-[11px] text-emerald-200/70">
            NINTROLLER
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <BaseButton
                button="select"
                down={isDown("select")}
                className={cx(
                  "h-8 w-16 rounded-full",
                  "bg-black shadow-[inset_0_2px_0_rgba(255,255,255,0.10)] ring-1 ring-emerald-300/15",
                  "transition-transform",
                  isDown("select") && "translate-y-[1px] shadow-none"
                )}
                onChange={(p) => setButtonPressed("select", p, "pointer")}
              />
              <div className="font-pixel text-[10px] text-emerald-200/60">
                SELECT
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BaseButton
                button="start"
                down={isDown("start")}
                className={cx(
                  "h-8 w-16 rounded-full",
                  "bg-black shadow-[inset_0_2px_0_rgba(255,255,255,0.10)] ring-1 ring-emerald-300/15",
                  "transition-transform",
                  isDown("start") && "translate-y-[1px] shadow-none"
                )}
                onChange={(p) => setButtonPressed("start", p, "pointer")}
              />
              <div className="font-pixel text-[10px] text-emerald-200/60">
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
                "bg-rose-500/90 shadow-[inset_0_3px_0_rgba(255,255,255,0.18),_0_12px_22px_rgba(0,0,0,0.40)] ring-1 ring-white/10",
                "transition-transform",
                isDown("b") && "translate-y-[2px] shadow-none"
              )}
              onChange={(p) => setButtonPressed("b", p, "pointer")}
            />
            <div className="font-pixel text-[11px] text-emerald-100/70">B</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <BaseButton
              button="a"
              down={isDown("a")}
              className={cx(
                "h-16 w-16 rounded-full",
                "bg-rose-500/90 shadow-[inset_0_3px_0_rgba(255,255,255,0.18),_0_12px_22px_rgba(0,0,0,0.40)] ring-1 ring-white/10",
                "transition-transform",
                isDown("a") && "translate-y-[2px] shadow-none"
              )}
              onChange={(p) => setButtonPressed("a", p, "pointer")}
            />
            <div className="font-pixel text-[11px] text-emerald-100/70">A</div>
          </div>
        </div>
      </div>
    </div>
  );
}


