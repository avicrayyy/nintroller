"use client";

import * as React from "react";

function Card({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-emerald-300/20 bg-black/50 p-4 shadow-[0_0_0_1px_rgba(16,185,129,0.10),_0_18px_35px_rgba(0,0,0,0.45)] backdrop-blur",
        className ?? "",
      ].join(" ")}
    >
      <div className="font-pixel text-[11px] text-emerald-200/80">
        {title}
      </div>
      <div className="mt-2 text-sm text-emerald-100/90">
        {children}
      </div>
    </div>
  );
}

export function NoCheatsWarningCard() {
  return (
    <Card
      title="WARNING"
      className="border-rose-400/25 bg-rose-500/10 motion-safe:animate-wiggle"
    >
      <div className="font-pixel text-xs text-rose-200">NO CHEATS</div>
      <div className="mt-2 font-mono text-sm text-rose-100/90">
        No cheats.
      </div>
      <div className="mt-1 font-mono text-xs text-rose-100/70">
        Inputs are recorded + checked. Play it straight.
      </div>
    </Card>
  );
}

export function DesktopInputHelpCard() {
  return (
    <Card title="DESKTOP INPUT">
      <div className="space-y-1 font-mono text-sm">
        <div>
          <span className="text-emerald-200">Arrows</span> — D-pad
        </div>
        <div>
          <span className="text-emerald-200">Z</span> — B,{" "}
          <span className="text-emerald-200">X</span> — A
        </div>
        <div>
          <span className="text-emerald-200">Shift</span> — Select,{" "}
          <span className="text-emerald-200">Enter</span> — Start
        </div>
      </div>
    </Card>
  );
}


