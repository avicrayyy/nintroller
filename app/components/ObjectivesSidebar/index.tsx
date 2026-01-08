"use client";

import { useEffect, useRef, useState } from "react";

import { CHEATS, type Cheat } from "@/app/libs/cheats";

import {
  DesktopInputHelpCard,
  NoCheatsWarningCard,
} from "../ControllerConsoleCards";
import { IconButton } from "../ui/IconButton";

type CheatUnlockEvent = CustomEvent<{ cheat: Cheat }>;

function ObjectivesContent() {
  // Always start with empty Set for deterministic server/client render
  // Browser-only localStorage is read in effect after mount
  const [unlockedCheats, setUnlockedCheats] = useState<Set<string>>(
    () => new Set()
  );

  // Hydrate from localStorage after mount (browser-only API)
  // This is the correct pattern: deterministic initial render, then hydrate in effect
  useEffect(() => {
    const stored = localStorage.getItem("nintroller:unlocked-cheats");
    if (stored) {
      try {
        const ids = JSON.parse(stored) as string[];
        // Hydrating from browser-only localStorage after mount is the correct pattern
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUnlockedCheats(new Set(ids));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    // Listen for cheat unlocks
    const handleCheatUnlock = (e: Event) => {
      const customEvent = e as CheatUnlockEvent;
      setUnlockedCheats((prev) => {
        const next = new Set(prev);
        next.add(customEvent.detail.cheat.id);
        localStorage.setItem(
          "nintroller:unlocked-cheats",
          JSON.stringify([...next])
        );
        return next;
      });
    };

    window.addEventListener("cheat-unlocked", handleCheatUnlock);

    return () => {
      window.removeEventListener("cheat-unlocked", handleCheatUnlock);
    };
  }, []);

  return (
    <>
      <div className="mb-6">
        <div className="font-pixel text-[11px] text-emerald-200/80">
          OBJECTIVES
        </div>
        <div className="mt-1 font-mono text-[10px] text-emerald-100/60">
          Unlock all cheats
        </div>
      </div>

      <div className="space-y-3">
        {CHEATS.map((cheat) => {
          const isUnlocked = unlockedCheats.has(cheat.id);
          return (
            <div
              key={cheat.id}
              suppressHydrationWarning
              className={`rounded-lg border p-3 ${
                isUnlocked
                  ? "border-emerald-400/50 bg-emerald-400/10"
                  : "border-emerald-300/20 bg-black/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div
                    suppressHydrationWarning
                    className={`font-pixel text-[10px] ${
                      isUnlocked
                        ? "text-emerald-300"
                        : "text-emerald-100/60"
                    }`}
                  >
                    {isUnlocked ? "✓ " : "○ "}
                    {cheat.name}
                  </div>
                  <div className="mt-1.5 font-mono text-[9px] text-emerald-100/50">
                    {cheat.sequence
                      .map((btn) => btn.toUpperCase())
                      .join(" → ")}
                  </div>
                </div>
                {isUnlocked && (
                  <div
                    suppressHydrationWarning
                    className="font-pixel text-[8px] text-emerald-400"
                  >
                    UNLOCKED
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-emerald-300/20 pt-4">
        <div
          suppressHydrationWarning
          className="font-mono text-[9px] text-emerald-100/50"
        >
          Progress: {unlockedCheats.size} / {CHEATS.length}
        </div>
      </div>

      {/* Console Cards */}
      <div className="mt-6 space-y-4">
        <NoCheatsWarningCard />
        <DesktopInputHelpCard />
      </div>
    </>
  );
}

export function ObjectivesSidebar() {
  const [open, setOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
    else openButtonRef.current?.focus();
  }, [open]);

  return (
    <>
      {/* Mobile FAB */}
      <IconButton
        ref={openButtonRef}
        onClick={() => setOpen(true)}
        aria-label="Open objectives"
        variant="fab"
        className="fixed bottom-32 right-4 z-40 px-5 py-4 text-sm lg:hidden"
      >
        OBJ
      </IconButton>

      {/* Mobile modal-like sidebar */}
      {open ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Objectives"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
          <div className="absolute inset-y-0 left-0 w-[min(360px,calc(100vw-48px))] border-r border-emerald-300/20 bg-black/80 shadow-2xl backdrop-blur">
            <div className="flex h-full flex-col overflow-y-auto p-4">
              <div className="flex items-center justify-between">
                <div className="font-pixel text-[11px] text-emerald-200/80">
                  OBJECTIVES
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-50 hover:bg-emerald-400/15"
                >
                  Close
                </button>
              </div>

              <div className="mt-3">
                <ObjectivesContent />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Desktop fixed left sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-[360px] lg:border-r lg:border-emerald-300/20 lg:bg-black/60 lg:pt-14 lg:backdrop-blur">
        <div className="h-full overflow-y-auto px-6 pb-10">
          <ObjectivesContent />
        </div>
      </aside>
    </>
  );
}

