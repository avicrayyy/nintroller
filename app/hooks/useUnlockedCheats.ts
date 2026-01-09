import { useEffect, useState } from "react";
import type { Cheat } from "@/app/libs/cheats";

const STORAGE_KEY = "nintroller:unlocked-cheats";

/**
 * Manages unlocked cheats state with localStorage persistence
 */
export function useUnlockedCheats() {
  const [unlockedCheats, setUnlockedCheats] = useState<Set<string>>(
    () => new Set()
  );

  // Hydrate from localStorage after mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const ids = JSON.parse(stored) as string[];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUnlockedCheats(new Set(ids));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Listen for cheat unlocks and progress reset
  useEffect(() => {
    const handleCheatUnlock = (e: Event) => {
      const customEvent = e as CustomEvent<{ cheat: Cheat }>;
      setUnlockedCheats((prev) => {
        const next = new Set(prev);
        next.add(customEvent.detail.cheat.id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
        return next;
      });
    };

    const handleProgressReset = () => {
      localStorage.removeItem(STORAGE_KEY);
      setUnlockedCheats(new Set());
    };

    window.addEventListener("cheat-unlocked", handleCheatUnlock);
    window.addEventListener("progress-reset", handleProgressReset);

    return () => {
      window.removeEventListener("cheat-unlocked", handleCheatUnlock);
      window.removeEventListener("progress-reset", handleProgressReset);
    };
  }, []);

  return unlockedCheats;
}

