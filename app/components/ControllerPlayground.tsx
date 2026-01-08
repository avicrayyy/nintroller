"use client";

import { CheatModal } from "./CheatModal";
import {
  DesktopInputHelpCard,
  NoCheatsWarningCard,
} from "./ControllerConsoleCards";
import { useInputLog } from "./InputLog";
import { NESController } from "./NESController";
import { useId, useState } from "react";

export function ControllerPlayground() {
  const { addEvent } = useInputLog();
  const [lastCheat, setLastCheat] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [cheatModalOpen, setCheatModalOpen] = useState(false);
  const sessionId = useId();

  return (
    <div className="w-full">
      <CheatModal
        open={cheatModalOpen}
        cheat={lastCheat}
        onClose={() => setCheatModalOpen(false)}
      />
      <div className="text-center">
        <h1 className="font-pixel text-xl text-emerald-50 drop-shadow-[0_0_12px_rgba(16,185,129,0.18)] sm:text-2xl">
          NINTROLLER
        </h1>
        <p className="mt-3 font-mono text-sm text-emerald-100/70">
          Click/tap buttons or use your keyboard: Arrows, Z (B), X (A), Shift
          (Select), Enter (Start).
        </p>
      </div>

      <div className="mt-10 flex w-full justify-center lg:justify-start">
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
                    setCheatModalOpen(true);
                  }
                })
                .catch(() => {
                  // Ignore transient errors (e.g., offline).
                });
            }}
          />

          {/* "Console" area below controller */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <NoCheatsWarningCard />
            <DesktopInputHelpCard />
          </div>
        </div>
      </div>
    </div>
  );
}
