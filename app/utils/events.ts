/**
 * Typed event helpers for custom window events
 * Provides type-safe event creation and listening without casting
 */

// Event type definitions
export type CheatUnlockedEvent = CustomEvent<{
  cheat: { id: string; name: string };
}>;

export type ProgressResetEvent = CustomEvent<Record<string, never>>;

export type SidebarToggleEvent = CustomEvent<{ open: boolean }>;

export type SidebarOpenedEvent = CustomEvent<Record<string, never>>;

// Event names as constants
export const EVENT_NAMES = {
  CHEAT_UNLOCKED: "cheat-unlocked",
  PROGRESS_RESET: "progress-reset",
  OBJECTIVES_SIDEBAR_TOGGLED: "objectives-sidebar-toggled",
  INPUT_LOG_SIDEBAR_TOGGLED: "input-log-sidebar-toggled",
  OBJECTIVES_SIDEBAR_OPENED: "objectives-sidebar-opened",
  INPUT_LOG_SIDEBAR_OPENED: "input-log-sidebar-opened",
} as const;

/**
 * Create a typed cheat-unlocked event
 */
export function createCheatUnlockedEvent(
  cheat: { id: string; name: string }
): CheatUnlockedEvent {
  return new CustomEvent(EVENT_NAMES.CHEAT_UNLOCKED, {
    detail: { cheat },
  }) as CheatUnlockedEvent;
}

/**
 * Create a typed progress-reset event
 */
export function createProgressResetEvent(): ProgressResetEvent {
  return new CustomEvent(EVENT_NAMES.PROGRESS_RESET, {
    detail: {},
  }) as ProgressResetEvent;
}

/**
 * Create a typed sidebar toggle event
 */
export function createSidebarToggleEvent(
  eventName: typeof EVENT_NAMES.OBJECTIVES_SIDEBAR_TOGGLED | typeof EVENT_NAMES.INPUT_LOG_SIDEBAR_TOGGLED,
  open: boolean
): SidebarToggleEvent {
  return new CustomEvent(eventName, {
    detail: { open },
  }) as SidebarToggleEvent;
}

/**
 * Create a typed sidebar opened event
 */
export function createSidebarOpenedEvent(
  eventName: typeof EVENT_NAMES.OBJECTIVES_SIDEBAR_OPENED | typeof EVENT_NAMES.INPUT_LOG_SIDEBAR_OPENED
): SidebarOpenedEvent {
  return new CustomEvent(eventName, {
    detail: {},
  }) as SidebarOpenedEvent;
}

/**
 * Type guard to check if an event is a typed CustomEvent
 */
export function isTypedEvent<T>(
  event: Event,
  eventName: string
): event is CustomEvent<T> {
  return event instanceof CustomEvent && event.type === eventName;
}

/**
 * Helper to safely extract detail from a typed event
 */
export function getEventDetail<T>(event: CustomEvent<T>): T {
  return event.detail;
}

