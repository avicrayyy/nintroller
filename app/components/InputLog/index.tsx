"use client";

import * as React from "react";

import type { ButtonChangeEvent } from "@/app/components/NESController/types";

export type InputLogRow = ButtonChangeEvent & { ts: number };

type InputLogContextValue = {
  rows: InputLogRow[];
  addEvent: (e: ButtonChangeEvent, ts?: number) => void;
  clear: () => void;
};

const InputLogContext = React.createContext<InputLogContextValue | null>(null);

export function InputLogProvider({ children }: { children: React.ReactNode }) {
  const [rows, setRows] = React.useState<InputLogRow[]>([]);

  const addEvent = React.useCallback((e: ButtonChangeEvent, ts?: number) => {
    const at = typeof ts === "number" ? ts : Date.now();
    setRows((prev) => [{ ...e, ts: at }, ...prev].slice(0, 30));
  }, []);

  const clear = React.useCallback(() => setRows([]), []);

  const value = React.useMemo(() => ({ rows, addEvent, clear }), [rows, addEvent, clear]);

  return <InputLogContext.Provider value={value}>{children}</InputLogContext.Provider>;
}

export function useInputLog() {
  const ctx = React.useContext(InputLogContext);
  if (!ctx) throw new Error("useInputLog must be used within <InputLogProvider>");
  return ctx;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString(undefined, { hour12: false });
}

export function InputLog({ className }: { className?: string }) {
  const { rows, clear } = useInputLog();

  return (
    <div className={className}>
      <div className="sticky top-0 z-10 bg-inherit pt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-pixel text-xs text-emerald-200">INPUT LOG</h2>
        <button
          type="button"
          onClick={clear}
          className="rounded-md border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-400/15"
        >
          Clear
        </button>
        </div>
      </div>

      <div className="mt-3 max-h-[70vh] overflow-auto rounded-xl border border-emerald-300/20 bg-black/50 lg:max-h-[calc(100vh-7rem)]">
        {rows.length === 0 ? (
          <div className="px-4 py-6 font-mono text-sm text-emerald-200/70">
            Press something to see events…
          </div>
        ) : (
          <ul className="divide-y divide-emerald-300/10">
            {rows.map((row, idx) => (
              <li
                key={`${row.ts}-${idx}`}
                className="flex items-center justify-between gap-4 px-4 py-2 font-mono text-sm text-emerald-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-emerald-200/60">
                    {formatTime(row.ts)}
                  </span>
                  <span className="font-semibold text-emerald-100">
                    {row.button.toUpperCase()}
                  </span>
                  <span
                    className={
                      row.pressed
                        ? "text-emerald-300"
                        : "text-emerald-200/60"
                    }
                  >
                    {row.pressed ? "down" : "up"}
                  </span>
                </div>
                <span className="text-xs text-emerald-200/60">
                  {row.source}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


