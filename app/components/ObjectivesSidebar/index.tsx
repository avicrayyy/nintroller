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

    // Listen for progress reset
    const handleProgressReset = () => {
      // Clear localStorage to ensure it's synced
      localStorage.removeItem("nintroller:unlocked-cheats");
      // Reset state
      setUnlockedCheats(new Set());
    };

    window.addEventListener("cheat-unlocked", handleCheatUnlock);
    window.addEventListener("progress-reset", handleProgressReset);

    return () => {
      window.removeEventListener("cheat-unlocked", handleCheatUnlock);
      window.removeEventListener("progress-reset", handleProgressReset);
    };
  }, []);

  return (
    <>
      <div className="mb-6">
        <div className="hidden font-pixel text-[11px] text-emerald-200/80 lg:block">
          OBJECTIVES
        </div>
        <div className="mt-1 hidden font-mono text-[10px] text-emerald-100/60 lg:block">
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
                      isUnlocked ? "text-emerald-300" : "text-emerald-100/60"
                    }`}
                  >
                    {isUnlocked ? "✓ " : "○ "}
                    {cheat.name}
                  </div>
                  <div className="mt-1.5 font-mono text-[9px] text-emerald-100/50">
                    {cheat.sequence.map((btn) => btn.toUpperCase()).join(" → ")}
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
  // Always start closed for deterministic SSR
  const [open, setOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Open by default on desktop after mount (client-side hydration)
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      // Hydrating client-side screen size after mount is the correct pattern
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
      // Dispatch initial state so other components can sync
      window.dispatchEvent(
        new CustomEvent("objectives-sidebar-toggled", {
          detail: { open: true },
        })
      );
    }
  }, []);

  // Listen for other sidebar opening on mobile
  useEffect(() => {
    const handleOtherSidebarOpen = () => {
      if (window.innerWidth < 1024 && open) {
        setOpen(false);
      }
    };

    window.addEventListener("input-log-sidebar-opened", handleOtherSidebarOpen);
    return () => {
      window.removeEventListener(
        "input-log-sidebar-opened",
        handleOtherSidebarOpen
      );
    };
  }, [open]);

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
      {/* FAB - visible on all screen sizes */}
      <IconButton
        ref={openButtonRef}
        onClick={() => {
          const isMobile = window.innerWidth < 1024;
          if (isMobile) {
            setOpen(true);
            // Notify other sidebar to close on mobile
            window.dispatchEvent(
              new CustomEvent("objectives-sidebar-opened", { detail: {} })
            );
          } else {
            // Toggle on desktop
            setOpen((prev) => {
              const next = !prev;
              // Dispatch event for other components to track sidebar state
              window.dispatchEvent(
                new CustomEvent("objectives-sidebar-toggled", {
                  detail: { open: next },
                })
              );
              return next;
            });
          }
        }}
        aria-label={open ? "Close objectives" : "Open objectives"}
        variant="fab"
        label="OBJ"
        className={`fixed bottom-16 left-4 z-40 px-4 py-3 lg:transition-all lg:duration-300 ${
          open ? "lg:left-[376px]" : "lg:left-4"
        }`}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      </IconButton>

      {/* Mobile modal */}
      {open && (
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
          <div className="absolute inset-0 border-r border-emerald-300/20 bg-black/80 shadow-2xl backdrop-blur">
            <div className="flex h-full flex-col overflow-y-auto p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-pixel text-[11px] text-emerald-200/80">
                    OBJECTIVES
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-emerald-100/60">
                    Unlock all cheats
                  </div>
                </div>
                <IconButton
                  ref={closeButtonRef}
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  variant="fab"
                  className="!rounded-full h-8 w-8 p-0"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </IconButton>
              </div>

              <div className="mt-3">
                <ObjectivesContent />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop fixed left sidebar - always rendered, visibility controlled by parent layout */}
      <aside
        className={`hidden lg:block lg:w-[360px] lg:border-r lg:border-emerald-300/20 lg:bg-black/60 lg:pt-14 lg:backdrop-blur ${
          open ? "" : "lg:hidden"
        }`}
      >
        <div className="h-full overflow-y-auto px-6 pb-10">
          <ObjectivesContent />
        </div>
      </aside>
    </>
  );
}
