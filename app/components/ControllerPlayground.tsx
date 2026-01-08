"use client";

import { useState } from "react";

import { getOrCreateSessionId } from "@/app/utils";

import { Modal } from "./ui/Modal";
import { CheatContent, WelcomeContent } from "./ui/Modal/content";
import { useInputLog } from "./InputLog";
import { NESController } from "./NESController";

type ModalType = "welcome" | "cheat" | null;

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

  return (
    <div className="w-full">
      {/* Top-left FAB to open intro modal */}
      <button
        type="button"
        onClick={() => setModalType("welcome")}
        className="font-pixel fixed left-4 top-4 z-40 rounded-xl border border-emerald-300/25 bg-black/70 px-4 py-3 text-lg text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.10),_0_14px_30px_rgba(0,0,0,0.55)] backdrop-blur hover:bg-black/80 lg:left-[376px]"
        aria-label="Show help"
      >
        ?
      </button>

      {/* Single modal with conditional content */}
      <Modal
        open={modalType !== null}
        onClose={() => setModalType(null)}
        title={
          modalType === "cheat" ? "CHEAT UNLOCKED" : "WELCOME TO NINTROLLER"
        }
        footerButtonText={modalType === "cheat" ? "Continue" : "EXECUTE"}
        ariaLabel={modalType === "cheat" ? "Cheat detected" : undefined}
      >
        {modalType === "cheat" && lastCheat ? (
          <CheatContent cheat={lastCheat} />
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
