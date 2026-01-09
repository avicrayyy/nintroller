import { useEffect, useState } from "react";
import type { Cheat } from "@/app/libs/cheats";
import { EVENT_NAMES, isTypedEvent, getEventDetail } from "@/app/utils/events";

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
      if (isTypedEvent<{ cheat: Cheat }>(e, EVENT_NAMES.CHEAT_UNLOCKED)) {
        const detail = getEventDetail(e);
        setUnlockedCheats((prev) => {
          const next = new Set(prev);
          next.add(detail.cheat.id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
          return next;
        });
      }
    };

    const handleProgressReset = () => {
      localStorage.removeItem(STORAGE_KEY);
      setUnlockedCheats(new Set());
    };

    window.addEventListener(EVENT_NAMES.CHEAT_UNLOCKED, handleCheatUnlock);
    window.addEventListener(EVENT_NAMES.PROGRESS_RESET, handleProgressReset);

    return () => {
      window.removeEventListener(EVENT_NAMES.CHEAT_UNLOCKED, handleCheatUnlock);
      window.removeEventListener(
        EVENT_NAMES.PROGRESS_RESET,
        handleProgressReset
      );
    };
  }, []);

  return unlockedCheats;
}
