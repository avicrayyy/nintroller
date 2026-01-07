"use client";

import type { ButtonChangeEvent } from "./NESController";
import { NESController } from "./NESController";
import { useId, useState } from "react";

type LogRow = ButtonChangeEvent & { ts: number };

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString(undefined, { hour12: false });
}

export function ControllerPlayground() {
  const [log, setLog] = useState<LogRow[]>([]);
  const [lastCheat, setLastCheat] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const sessionId = useId();

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Nintendo (NES) Controller
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Click/tap buttons or use your keyboard: Arrows, Z (B), X (A), Shift
          (Select), Enter (Start).
        </p>
        <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          {lastCheat ? (
            <>
              Detected cheat:{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {lastCheat.name}
              </span>
            </>
          ) : (
            <>No cheat detected yet.</>
          )}
        </div>
      </div>

      <NESController
        onButtonChange={(e) => {
          setLog((prev) => [{ ...e, ts: Date.now() }, ...prev].slice(0, 30));

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
              }
            })
            .catch(() => {
              // Ignore transient errors (e.g., offline).
            });
        }}
      />

      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Input log
          </h2>
          <button
            type="button"
            onClick={() => setLog([])}
            className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Clear
          </button>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-zinc-950">
          {log.length === 0 ? (
            <div className="px-4 py-6 text-sm text-zinc-500 dark:text-zinc-400">
              Press something to see events…
            </div>
          ) : (
            <ul className="divide-y divide-black/5 dark:divide-white/10">
              {log.map((row, idx) => (
                <li
                  key={`${row.ts}-${idx}`}
                  className="flex items-center justify-between gap-4 px-4 py-2 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      {formatTime(row.ts)}
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {row.button.toUpperCase()}
                    </span>
                    <span
                      className={
                        row.pressed
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-zinc-500 dark:text-zinc-400"
                      }
                    >
                      {row.pressed ? "down" : "up"}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {row.source}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
