"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { ButtonChangeEvent } from "@/app/types/nes-controller";

import { Button } from "../ui/Button";
import { cx } from "@/app/utils";

export type InputLogRow = ButtonChangeEvent & { ts: number };

type InputLogContextValue = {
  rows: InputLogRow[];
  addEvent: (e: ButtonChangeEvent, ts?: number) => void;
  clear: () => void;
};

const InputLogContext = createContext<InputLogContextValue | null>(null);

export function InputLogProvider({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<InputLogRow[]>([]);

  const addEvent = useCallback((e: ButtonChangeEvent, ts?: number) => {
    const at = typeof ts === "number" ? ts : Date.now();
    setRows((prev) => [{ ...e, ts: at }, ...prev].slice(0, 30));
  }, []);

  const clear = useCallback(() => setRows([]), []);

  const value = useMemo(
    () => ({ rows, addEvent, clear }),
    [rows, addEvent, clear]
  );

  return (
    <InputLogContext.Provider value={value}>
      {children}
    </InputLogContext.Provider>
  );
}

export function useInputLog() {
  const ctx = useContext(InputLogContext);
  if (!ctx)
    throw new Error("useInputLog must be used within <InputLogProvider>");
  return ctx;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString(undefined, { hour12: false });
}

export function InputLog({ className }: { className?: string }) {
  const { rows, clear } = useInputLog();

  return (
    <div className={cx("flex h-full flex-col", className)}>
      <div className="sticky top-0 z-10 bg-inherit pt-2">
        <h2 className="hidden font-pixel text-xs text-emerald-200 lg:block">
          INPUT LOG
        </h2>
      </div>

      <div className="mt-3 flex-1 overflow-auto rounded-xl border border-emerald-300/20 bg-black/50">
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
                      row.pressed ? "text-emerald-300" : "text-emerald-200/60"
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

      <div className="sticky bottom-0 z-10 bg-inherit pt-3">
        <Button
          onClick={clear}
          variant="emerald"
          className="w-full px-3 py-1.5 text-xs"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
