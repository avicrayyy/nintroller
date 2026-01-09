"use client";

import { useCallback, useState } from "react";

import { detectCheat, maxCheatLength } from "@/app/libs/cheats";
import type { NESButton } from "@/app/types/nes-controller";

import { Modal } from "../ui/Modal";
import {
  CheatContent,
  ResetProgressContent,
  WelcomeContent,
} from "../ui/Modal/content";
import Link from "next/link";
import { IconButton } from "../ui/IconButton";
import { useInputLog } from "../InputLog";
import { NESController } from "../NESController";
import { GitHubIcon, ResetIcon } from "../icons";
import { useSidebarToggleEvents } from "@/app/hooks";
import {
  cx,
  createCheatUnlockedEvent,
  createProgressResetEvent,
  SHADOWS,
} from "@/app/utils";

type ModalType = "welcome" | "cheat" | "reset" | null;

export function ControllerPlayground() {
  const { addEvent } = useInputLog();
  const [lastCheat, setLastCheat] = useState<{
    id: string;
    name: string;
  } | null>(null);
  // Track pressed button sequence for client-side cheat detection
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pressedSequence, setPressedSequence] = useState<NESButton[]>([]);
  // Single modal state: tracks which modal type is open (or null if closed)
  const [modalType, setModalType] = useState<ModalType>("welcome");
  // Track sidebar states for FAB positioning
  const { leftSidebarOpen, rightSidebarOpen } = useSidebarToggleEvents();

  const handleResetProgress = useCallback(() => {
    // Clear unlocked cheats from localStorage
    localStorage.removeItem("nintroller:unlocked-cheats");
    // Dispatch event to update objectives sidebar (must be synchronous)
    window.dispatchEvent(createProgressResetEvent());
  }, []);

  return (
    <div className="w-full">
      {/* Top-left FAB to open intro modal */}
      <IconButton
        onClick={() => setModalType("welcome")}
        aria-label="Show help"
        variant="fab"
        className={cx(
          "fixed left-4 top-16 z-40 px-4 py-3 text-lg",
          "transition-all duration-300",
          "hover:[&>span]:animate-[glitch_0.3s_ease-in-out_infinite]",
          "lg:transition-all lg:duration-300",
          leftSidebarOpen ? "lg:left-[376px]" : "lg:left-4"
        )}
      >
        <span className="inline-block">?</span>
      </IconButton>

      {/* Top-right FAB to reset progress */}
      <IconButton
        onClick={() => setModalType("reset")}
        aria-label="Reset progress"
        variant="fab"
        className={cx(
          "group fixed right-4 top-16 z-40 px-4 py-3 text-sm",
          "transition-all duration-300",
          "lg:transition-all lg:duration-300",
          rightSidebarOpen ? "lg:right-[376px]" : "lg:right-4"
        )}
      >
        <div className="flex items-center gap-2">
          <ResetIcon className="h-4 w-4 transition-transform group-hover:animate-[spin-pause_1.5s_ease-in-out_infinite]" />
          <span className="text-xs">RESET</span>
        </div>
      </IconButton>

      {/* Single modal with conditional content */}
      <Modal
        open={modalType !== null}
        onClose={() => setModalType(null)}
        title={
          modalType === "cheat"
            ? "CHEAT UNLOCKED"
            : modalType === "reset"
            ? "RESET PROGRESS"
            : "WELCOME TO NINTROLLER"
        }
        footerButtonText={
          modalType === "cheat"
            ? "Continue"
            : modalType === "reset"
            ? "CONFIRM"
            : "Lez Ge Tit"
        }
        ariaLabel={
          modalType === "cheat"
            ? "Cheat detected"
            : modalType === "reset"
            ? "Reset progress confirmation"
            : undefined
        }
        onConfirm={modalType === "reset" ? handleResetProgress : undefined}
      >
        {modalType === "cheat" && lastCheat ? (
          <CheatContent cheat={lastCheat} />
        ) : modalType === "reset" ? (
          <ResetProgressContent />
        ) : (
          <WelcomeContent />
        )}
      </Modal>
      <div className="text-center">
        <h1
          className={`font-pixel text-xl text-emerald-50 ${SHADOWS.titleGlow} sm:text-2xl`}
        >
          NINTROLLER
        </h1>
        <p className="mt-3 font-mono text-sm text-emerald-100/70">
          Click/tap buttons or use your keyboard: Arrows, Z (B), X (A), Shift
          (Select), Enter (Start).
        </p>
      </div>

      <div className="mt-10 flex w-full justify-center">
        <div className="w-full max-w-3xl">
          <NESController
            onButtonChange={(e) => {
              addEvent(e);

              // Client-side cheat detection (only check on button press, not release)
              if (e.pressed) {
                setPressedSequence((prev) => {
                  const newSequence = [...prev, e.button];
                  const maxLen = maxCheatLength();
                  // Keep only the last N buttons (enough to detect longest cheat)
                  const trimmed = newSequence.slice(-Math.max(10, maxLen * 2));

                  // Detect cheat in the trimmed sequence
                  const cheat = detectCheat(trimmed);
                  if (cheat) {
                    setLastCheat({
                      id: cheat.id,
                      name: cheat.name,
                    });
                    // Defer event dispatch to avoid updating during render
                    queueMicrotask(() => {
                      window.dispatchEvent(
                        createCheatUnlockedEvent({
                          id: cheat.id,
                          name: cheat.name,
                        })
                      );
                    });
                    // Open cheat modal (will override welcome modal if open)
                    setModalType("cheat");
                  }

                  return trimmed;
                });
              }

              /*
               * EXAMPLE: Server-side cheat detection (commented out)
               *
               * If you need server-side detection (e.g., for analytics, rate limiting,
               * or preventing client-side manipulation), use the proper abstraction:
               *
               * ```typescript
               * import { detectCheatOnServer } from "@/app/libs/api/cheats";
               *
               * if (e.pressed) {
               *   try {
               *     const result = await detectCheatOnServer(sessionId, e);
               *     if (result.detected) {
               *       setLastCheat({
               *         id: result.detected.id,
               *         name: result.detected.name,
               *       });
               *       window.dispatchEvent(
               *         new CustomEvent("cheat-unlocked", {
               *           detail: { cheat: result.detected },
               *         })
               *       );
               *       setModalType("cheat");
               *     }
               *   } catch (error) {
               *     // Handle error (e.g., offline, rate limited)
               *     console.error("Cheat detection failed:", error);
               *   }
               * }
               * ```
               *
               * NOTE: The above requires:
               * - sessionId state: `const [sessionId] = useState(() => getOrCreateSessionId());`
               * - Import: `import { getOrCreateSessionId } from "@/app/utils";`
               *
               * Current implementation uses client-side detection for:
               * - Better performance (no network latency)
               * - No server costs/abuse risk
               * - Works offline
               */
            }}
          />
        </div>
      </div>

      {/* GitHub link at footer level */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <Link
          href="https://github.com/avicrayyy/nintroller"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 rounded"
          aria-label="View source code on GitHub"
        >
          <GitHubIcon className="h-10 w-10 text-emerald-400 transition-colors group-hover:text-emerald-300" />
          <span className="font-mono text-xs text-emerald-400/80 group-hover:text-emerald-300/80 transition-colors">
            VIEW ON GITHUB
          </span>
        </Link>
      </div>
    </div>
  );
}
