"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type {
  ButtonChangeEvent,
  InputSource,
  NESButton,
} from "@/app/types/nes-controller";
import { cx, RINGS } from "@/app/utils";

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
        "w-full max-w-3xl relative",
        "rounded-[28px] border border-zinc-400/30 bg-zinc-200/95 shadow-[0_0_0_1px_rgba(0,0,0,0.1),_0_18px_45px_rgba(0,0,0,0.3),_0_25px_50px_rgba(0,0,0,0.4)] backdrop-blur",
        "px-3 pt-4 pb-2 sm:px-4 sm:pt-6 sm:pb-3",
        className
      )}
    >
      {/* Inner black panel (mimics the dark gray central panel on real controller) */}
      <div className="absolute inset-x-3 top-4 bottom-2 sm:inset-x-4 sm:top-6 sm:bottom-3 rounded-2xl bg-black/90" />

      {/* Mobile emulator layout */}
      <div className="relative grid grid-cols-2 items-center gap-5 sm:hidden">
        {/* D-Pad */}
        <div className="relative h-[132px] w-[132px]">
          <div className={`absolute inset-0 rounded-2xl bg-zinc-300/40 ${RINGS.light}`} />
          <BaseButton
            button="up"
            down={isDown("up")}
            className={cx(
              "absolute left-1/2 top-2 h-10 w-12 -translate-x-1/2 rounded-lg",
              "bg-zinc-800 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.15)] ring-1 ring-zinc-600/40",
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
              "bg-zinc-800 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.15)] ring-1 ring-zinc-600/40",
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
              "bg-zinc-800 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.15)] ring-1 ring-zinc-600/40",
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
              "bg-zinc-800 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.15)] ring-1 ring-zinc-600/40",
              "transition-transform",
              isDown("right") && "translate-y-[calc(-50%+1px)] shadow-none"
            )}
            onChange={(p) => setButtonPressed("right", p, "pointer")}
          />
          <div className={`absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-800 ${RINGS.medium}`} />
        </div>

        {/* A/B cluster (mobile: diagonal like emulator) */}
        <div className="relative h-[132px] w-[172px] justify-self-end">
          <div className={`absolute inset-0 rounded-2xl bg-zinc-300/40 ${RINGS.light}`} />

          <div className="absolute left-3 bottom-3 flex flex-col items-center gap-2">
            <div className="rounded-lg bg-white p-1.5">
              <BaseButton
                button="b"
                down={isDown("b")}
                className={cx(
                  "h-14 w-14 rounded-full",
                  "bg-red-600 shadow-[inset_0_3px_0_rgba(255,255,255,0.25),_0_10px_20px_rgba(0,0,0,0.35)] ring-1 ring-red-700/40",
                  "transition-transform",
                  isDown("b") && "translate-y-[2px] shadow-none"
                )}
                onChange={(p) => setButtonPressed("b", p, "pointer")}
              />
            </div>
            <div className="font-pixel text-[10px] text-red-600">B</div>
          </div>

          <div className="absolute right-3 top-3 flex flex-col items-center gap-2">
            <div className="rounded-lg bg-white p-1.5">
              <BaseButton
                button="a"
                down={isDown("a")}
                className={cx(
                  "h-14 w-14 rounded-full",
                  "bg-red-600 shadow-[inset_0_3px_0_rgba(255,255,255,0.25),_0_10px_20px_rgba(0,0,0,0.35)] ring-1 ring-red-700/40",
                  "transition-transform",
                  isDown("a") && "translate-y-[2px] shadow-none"
                )}
                onChange={(p) => setButtonPressed("a", p, "pointer")}
              />
            </div>
            <div className="font-pixel text-[10px] text-red-600">A</div>
          </div>
        </div>

        {/* Select / Start row (mobile: centered) */}
        <div className="col-span-2 flex flex-col items-center gap-2 pt-1">
          {/* Text labels in white box */}
          <div className="rounded-lg bg-white px-3 py-1.5">
            <div className="flex items-center gap-4">
              <div className="font-pixel text-[10px] text-red-600">SELECT</div>
              <div className="font-pixel text-[10px] text-red-600">START</div>
            </div>
          </div>
          {/* Buttons in white box */}
          <div className="rounded-lg bg-white p-1.5">
            <div className="flex items-center gap-4">
              <BaseButton
                button="select"
                down={isDown("select")}
                className={cx(
                  "h-8 w-20 rounded-full",
                  "bg-zinc-800 shadow-[inset_0_2px_0_rgba(255,255,255,0.15)] ring-1 ring-zinc-600/40",
                  "transition-transform",
                  isDown("select") && "translate-y-[1px] shadow-none"
                )}
                onChange={(p) => setButtonPressed("select", p, "pointer")}
              />
              <BaseButton
                button="start"
                down={isDown("start")}
                className={cx(
                  "h-8 w-20 rounded-full",
                  "bg-zinc-800 shadow-[inset_0_2px_0_rgba(255,255,255,0.15)] ring-1 ring-zinc-600/40",
                  "transition-transform",
                  isDown("start") && "translate-y-[1px] shadow-none"
                )}
                onChange={(p) => setButtonPressed("start", p, "pointer")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop layout (keeps the classic row) */}
      <div className="relative hidden items-center justify-between gap-6 sm:flex m-10 mt-20">
        {/* D-Pad */}
        <div className="relative h-[150px] w-[150px] shrink-0">
          <div className={`absolute inset-0 rounded-2xl bg-zinc-300/40 ${RINGS.light}`} />
          <BaseButton
            button="up"
            down={isDown("up")}
            className={cx(
              "absolute left-1/2 top-3 h-12 w-14 -translate-x-1/2 rounded-lg",
              "bg-zinc-800 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.15)] ring-1 ring-zinc-600/40",
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
              "bg-zinc-800 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.15)] ring-1 ring-zinc-600/40",
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
              "bg-zinc-800 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.15)] ring-1 ring-zinc-600/40",
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
              "bg-zinc-800 text-zinc-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.15)] ring-1 ring-zinc-600/40",
              "transition-transform",
              isDown("right") && "translate-y-[calc(-50%+1px)] shadow-none"
            )}
            onChange={(p) => setButtonPressed("right", p, "pointer")}
          />
          <div className={`absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-800 ${RINGS.medium}`} />
        </div>

        {/* Center: Select / Start */}
        <div className="flex grow flex-col items-center gap-4">
          <div className="font-pixel text-[11px] text-zinc-600">NINTROLLER</div>
          <div className="flex flex-col items-center gap-2">
            {/* Text labels in white box */}
            <div className="rounded-lg bg-white px-3 py-1">
              <div className="flex items-center gap-4">
                <div className="font-pixel text-[10px] text-red-600">
                  SELECT
                </div>
                <div className="font-pixel text-[10px] text-red-600">START</div>
              </div>
            </div>
            {/* Buttons in white box */}
            <div className="rounded-lg bg-white p-2">
              <div className="flex items-center gap-4">
                <BaseButton
                  button="select"
                  down={isDown("select")}
                  className={cx(
                    "h-8 w-16 rounded-full",
                    "bg-zinc-800 shadow-[inset_0_2px_0_rgba(255,255,255,0.15)] ring-1 ring-zinc-600/40",
                    "transition-transform",
                    isDown("select") && "translate-y-[1px] shadow-none"
                  )}
                  onChange={(p) => setButtonPressed("select", p, "pointer")}
                />
                <BaseButton
                  button="start"
                  down={isDown("start")}
                  className={cx(
                    "h-8 w-16 rounded-full",
                    "bg-zinc-800 shadow-[inset_0_2px_0_rgba(255,255,255,0.15)] ring-1 ring-zinc-600/40",
                    "transition-transform",
                    isDown("start") && "translate-y-[1px] shadow-none"
                  )}
                  onChange={(p) => setButtonPressed("start", p, "pointer")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* A / B Buttons */}
        <div className="flex shrink-0 items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg bg-white p-2">
              <BaseButton
                button="b"
                down={isDown("b")}
                className={cx(
                  "h-16 w-16 rounded-full",
                  "bg-red-600 shadow-[inset_0_3px_0_rgba(255,255,255,0.25),_0_12px_22px_rgba(0,0,0,0.40)] ring-1 ring-red-700/40",
                  "transition-transform",
                  isDown("b") && "translate-y-[2px] shadow-none"
                )}
                onChange={(p) => setButtonPressed("b", p, "pointer")}
              />
            </div>
            <div className="font-pixel text-[11px] text-red-600">B</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg bg-white p-2">
              <BaseButton
                button="a"
                down={isDown("a")}
                className={cx(
                  "h-16 w-16 rounded-full",
                  "bg-red-600 shadow-[inset_0_3px_0_rgba(255,255,255,0.25),_0_12px_22px_rgba(0,0,0,0.40)] ring-1 ring-red-700/40",
                  "transition-transform",
                  isDown("a") && "translate-y-[2px] shadow-none"
                )}
                onChange={(p) => setButtonPressed("a", p, "pointer")}
              />
            </div>
            <div className="font-pixel text-[11px] text-red-600">A</div>
          </div>
        </div>
      </div>
    </div>
  );
}
