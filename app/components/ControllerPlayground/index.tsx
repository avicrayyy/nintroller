"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getOrCreateSessionId } from "@/app/utils";

import { Modal } from "../ui/Modal";
import {
  CheatContent,
  ResetProgressContent,
  WelcomeContent,
} from "../ui/Modal/content";
import { IconButton } from "../ui/IconButton";
import { useInputLog } from "../InputLog";
import { NESController } from "../NESController";

type ModalType = "welcome" | "cheat" | "reset" | null;

export function ControllerPlayground() {
  const { addEvent } = useInputLog();
  const [lastCheat, setLastCheat] = useState<{
    id: string;
    name: string;
  } | null>(null);
  // Initialize session ID from localStorage using lazy initialization
  const [sessionId] = useState(() => getOrCreateSessionId());
  // Single modal state: tracks which modal type is open (or null if closed)
  const [modalType, setModalType] = useState<ModalType>("welcome");
  // Track sidebar states for FAB positioning
  // Initialize to false to match SSR (will be updated in useEffect for desktop)
  // This prevents hydration mismatches
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  // Track if we've done the initial sync to prevent events from overriding initial state
  const hasInitializedRef = useRef(false);

  // Listen to sidebar toggle events on desktop
  useEffect(() => {
    // Ensure state is correct on desktop (sidebars open by default)
    // Do this first, before setting up event listeners, to prevent race conditions
    if (window.innerWidth >= 1024) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLeftSidebarOpen(true);

      setRightSidebarOpen(true);
      hasInitializedRef.current = true;
    }

    const handleObjectivesToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ open: boolean }>;
      if (window.innerWidth >= 1024 && hasInitializedRef.current) {
        setLeftSidebarOpen(customEvent.detail.open);
      }
    };

    const handleInputLogToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ open: boolean }>;
      if (window.innerWidth >= 1024 && hasInitializedRef.current) {
        setRightSidebarOpen(customEvent.detail.open);
      }
    };

    // Listen for sidebar toggle events (only after initial sync)
    window.addEventListener(
      "objectives-sidebar-toggled",
      handleObjectivesToggle
    );
    window.addEventListener("input-log-sidebar-toggled", handleInputLogToggle);

    return () => {
      window.removeEventListener(
        "objectives-sidebar-toggled",
        handleObjectivesToggle
      );
      window.removeEventListener(
        "input-log-sidebar-toggled",
        handleInputLogToggle
      );
    };
  }, []);

  const handleResetProgress = useCallback(() => {
    // Clear unlocked cheats from localStorage
    localStorage.removeItem("nintroller:unlocked-cheats");
    // Dispatch event to update objectives sidebar (must be synchronous)
    const event = new CustomEvent("progress-reset", { detail: {} });
    window.dispatchEvent(event);
  }, []);

  return (
    <div className="w-full">
      {/* Top-left FAB to open intro modal */}
      <IconButton
        onClick={() => setModalType("welcome")}
        aria-label="Show help"
        variant="fab"
        className={`fixed left-4 top-16 z-40 px-4 py-3 text-lg transition-all duration-300 hover:[&>span]:animate-[glitch_0.3s_ease-in-out_infinite] lg:transition-all lg:duration-300 ${
          leftSidebarOpen ? "lg:left-[376px]" : "lg:left-4"
        }`}
      >
        <span className="inline-block">?</span>
      </IconButton>

      {/* Top-right FAB to reset progress */}
      <IconButton
        onClick={() => setModalType("reset")}
        aria-label="Reset progress"
        variant="fab"
        className={`fixed right-4 top-16 z-40 px-4 py-3 text-sm transition-all duration-300 lg:transition-all lg:duration-300 ${
          rightSidebarOpen ? "lg:right-[376px]" : "lg:right-4"
        }`}
      >
        RESET
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
        <h1 className="font-pixel text-xl text-emerald-50 drop-shadow-[0_0_12px_rgba(16,185,129,0.18)] sm:text-2xl">
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

              // Store input + detect cheats server-side.
              void fetch("/api/cheats", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ sessionId, event: e, ts: Date.now() }),
              })
                .then((r) => r.json())
                .then((data) => {
                  if (data?.detected?.id && data?.detected?.name) {
                    setLastCheat({
                      id: data.detected.id,
                      name: data.detected.name,
                    });
                    // Dispatch custom event for objectives sidebar
                    const cheat = {
                      id: data.detected.id,
                      name: data.detected.name,
                    };
                    window.dispatchEvent(
                      new CustomEvent("cheat-unlocked", { detail: { cheat } })
                    );
                    // Open cheat modal (will override welcome modal if open)
                    setModalType("cheat");
                  }
                })
                .catch(() => {
                  // Ignore transient errors (e.g., offline).
                });
            }}
          />
        </div>
      </div>
    </div>
  );
}
