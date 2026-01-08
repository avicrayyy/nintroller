"use client";

export function Footer() {
  return (
    <footer className="border-t border-emerald-300/20 bg-black/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-6 sm:px-10">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <div className="font-pixel text-xs text-emerald-200/80">
              NINTROLLER
            </div>
            <div className="mt-1 font-mono text-[10px] text-emerald-100/60">
              Retro NES Controller Simulator
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/avicrayyy/nintroller"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-emerald-200/70 hover:text-emerald-100 transition-colors"
              aria-label="GitHub repository"
            >
              GITHUB
            </a>
            <div className="h-3 w-px bg-emerald-300/30" />
            <div className="font-mono text-[10px] text-emerald-100/50">
              Made with ❤️ and lots of button presses
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

