import type { ButtonChangeEvent } from "@/app/types/nes-controller";

type CheatDetectionResponse = {
  ok: boolean;
  detected: { id: string; name: string } | null;
  error?: string;
};

/**
 * Client-side API abstraction for cheat detection.
 * 
 * This provides a clean interface for calling the cheat detection API
 * without coupling the component to fetch/HTTP details.
 * 
 * NOTE: Currently unused - cheat detection is done client-side.
 * This is kept as an example of proper API abstraction.
 */
export async function detectCheatOnServer(
  sessionId: string,
  event: ButtonChangeEvent,
  timestamp?: number
): Promise<CheatDetectionResponse> {
  try {
    const response = await fetch("/api/cheats", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sessionId,
        event,
        ts: timestamp ?? Date.now(),
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        detected: null,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      ok: data.ok ?? false,
      detected: data.detected ?? null,
      error: data.error,
    };
  } catch (error) {
    return {
      ok: false,
      detected: null,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

