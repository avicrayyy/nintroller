import { NextResponse } from "next/server";

import { detectCheat, maxCheatLength } from "../../libs/cheats";
import type {
  ButtonChangeEvent,
  NESButton,
} from "../../components/NESController/types";

type StoredEvent = ButtonChangeEvent & { ts: number };

type SessionState = {
  createdAt: number;
  updatedAt: number;
  events: StoredEvent[];
  pressed: NESButton[];
  detections: Array<{ ts: number; cheatId: string; cheatName: string }>;
};

const SESSIONS = new Map<string, SessionState>();
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_EVENTS = 500;

function now() {
  return Date.now();
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function cleanupSessions() {
  const t = now();
  for (const [id, s] of SESSIONS) {
    if (t - s.updatedAt > SESSION_TTL_MS) SESSIONS.delete(id);
  }
}

function isValidButton(b: unknown): b is NESButton {
  return (
    b === "up" ||
    b === "down" ||
    b === "left" ||
    b === "right" ||
    b === "select" ||
    b === "start" ||
    b === "b" ||
    b === "a"
  );
}

function isValidSource(s: unknown): s is "pointer" | "keyboard" {
  return s === "pointer" || s === "keyboard";
}

function getOrCreateSession(sessionId: string): SessionState {
  const existing = SESSIONS.get(sessionId);
  if (existing) return existing;
  const t = now();
  const created: SessionState = {
    createdAt: t,
    updatedAt: t,
    events: [],
    pressed: [],
    detections: [],
  };
  SESSIONS.set(sessionId, created);
  return created;
}

export async function POST(req: Request) {
  cleanupSessions();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;
  const ts = typeof body.ts === "number" ? body.ts : now();
  const eventRaw = body.event;

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }
  if (!isRecord(eventRaw)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const button = eventRaw.button;
  const pressed = eventRaw.pressed;
  const source = eventRaw.source;

  if (
    !isValidButton(button) ||
    typeof pressed !== "boolean" ||
    !isValidSource(source)
  ) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const s = getOrCreateSession(sessionId);
  s.updatedAt = now();
  s.events.unshift({ button, pressed, source, ts });
  if (s.events.length > MAX_EVENTS) s.events.length = MAX_EVENTS;

  // Cheat detection is based on button-down only.
  if (pressed) {
    s.pressed.push(button);
    const maxLen = maxCheatLength();
    if (s.pressed.length > Math.max(10, maxLen * 2)) {
      s.pressed.splice(0, s.pressed.length - Math.max(10, maxLen * 2));
    }

    const cheat = detectCheat(s.pressed);
    if (cheat) {
      s.detections.unshift({ ts, cheatId: cheat.id, cheatName: cheat.name });
    }

    return NextResponse.json({
      ok: true,
      detected: cheat ? { id: cheat.id, name: cheat.name } : null,
    });
  }

  return NextResponse.json({ ok: true, detected: null });
}

export async function GET(req: Request) {
  cleanupSessions();

  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  const s = SESSIONS.get(sessionId);
  if (!s) {
    return NextResponse.json({
      ok: true,
      session: null,
    });
  }

  return NextResponse.json({
    ok: true,
    session: {
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      events: s.events,
      pressed: s.pressed,
      detections: s.detections,
    },
  });
}
