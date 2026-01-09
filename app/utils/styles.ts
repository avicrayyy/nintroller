/**
 * Reusable Tailwind className constants
 * Extracted long/complex className strings for better maintainability
 */

// Shadow styles
export const SHADOWS = {
  /** Modal shadow: emerald border glow + deep drop shadow */
  modal: "shadow-[0_0_0_1px_rgba(16,185,129,0.15),_0_22px_50px_rgba(0,0,0,0.65)]",
  /** Card shadow: subtle emerald glow + medium drop shadow */
  card: "shadow-[0_0_0_1px_rgba(16,185,129,0.10),_0_18px_35px_rgba(0,0,0,0.45)]",
  /** Title drop shadow: emerald glow effect */
  titleGlow: "drop-shadow-[0_0_12px_rgba(16,185,129,0.18)]",
} as const;

// Ring styles (for NES Controller buttons)
export const RINGS = {
  /** Light ring for D-pad and button areas */
  light: "ring-1 ring-zinc-400/30",
  /** Medium ring for button centers */
  medium: "ring-2 ring-zinc-600/30",
} as const;

// Background gradients (for layout effects)
export const BACKGROUNDS = {
  /** CRT scanline effect */
  crtScanlines:
    "[background:repeating-linear-gradient(to_bottom,rgba(255,255,255,0.05),rgba(255,255,255,0.05)_1px,transparent_1px,transparent_3px)]",
  /** Radial emerald glow effect */
  emeraldGlow:
    "[background:radial-gradient(ellipse_at_center,rgba(16,185,129,0.16)_0%,transparent_60%)]",
} as const;

