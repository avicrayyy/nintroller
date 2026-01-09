"use client";

import { useRef } from "react";

import { CHEATS } from "@/app/libs/cheats";

import {
  DesktopInputHelpCard,
  NoCheatsWarningCard,
} from "../ControllerConsoleCards";
import { IconButton } from "../ui/IconButton";
import { ChecklistIcon, CloseIcon } from "../icons";
import {
  useEscapeKey,
  useFocusManagement,
  useSidebarState,
  useUnlockedCheats,
} from "@/app/hooks";
import { cx } from "@/app/utils";

function ObjectivesContent() {
  const unlockedCheats = useUnlockedCheats();

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
              className={cx(
                "rounded-lg border p-3",
                isUnlocked
                  ? "border-emerald-400/50 bg-emerald-400/10"
                  : "border-emerald-300/20 bg-black/40"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div
                    suppressHydrationWarning
                    className={cx(
                      "font-pixel text-[10px]",
                      isUnlocked ? "text-emerald-300" : "text-emerald-100/60"
                    )}
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
  const openButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const { open, setOpen, toggle } = useSidebarState({
    otherSidebarEvent: "input-log-sidebar-opened",
    openEvent: "objectives-sidebar-opened",
    toggleEvent: "objectives-sidebar-toggled",
  });

  useEscapeKey(open, () => setOpen(false));
  useFocusManagement(open, openButtonRef, closeButtonRef);

  return (
    <>
      {/* FAB - visible on all screen sizes */}
      <IconButton
        ref={openButtonRef}
        onClick={toggle}
        aria-label={open ? "Close objectives" : "Open objectives"}
        variant="fab"
        label="OBJ"
        className={cx(
          "fixed bottom-16 left-4 z-40 px-4 py-3",
          "lg:transition-all lg:duration-300",
          open ? "lg:left-[376px]" : "lg:left-4"
        )}
      >
        <ChecklistIcon className="h-5 w-5" />
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
                  <CloseIcon className="h-4 w-4" />
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
        className={cx(
          "hidden lg:w-[360px] lg:border-r lg:border-emerald-300/20",
          "lg:bg-black/60 lg:pt-14 lg:backdrop-blur",
          open && "lg:block"
        )}
      >
        <div className="h-full overflow-y-auto px-6 pb-10">
          <ObjectivesContent />
        </div>
      </aside>
    </>
  );
}
