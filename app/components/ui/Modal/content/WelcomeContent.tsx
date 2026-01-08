export function WelcomeContent() {
  return (
    <div className="space-y-3">
      <p>
        A retro-themed NES controller simulator with real-time input logging
        and cheat code detection.
      </p>
      <div className="space-y-2">
        <p className="font-pixel text-xs text-emerald-200/90">CONTROLS:</p>
        <ul className="ml-4 list-disc space-y-1 text-sm">
          <li>
            <span className="text-emerald-200">Keyboard</span>: Arrows (D-pad),
            Z (B), X (A), Shift (Select), Enter (Start)
          </li>
          <li>
            <span className="text-emerald-200">Mouse/Touch</span>: Click or tap
            any button
          </li>
        </ul>
      </div>
      <div className="space-y-2">
        <p className="font-pixel text-xs text-emerald-200/90">
          TRY THESE CHEATS:
        </p>
        <ul className="ml-4 list-disc space-y-1 text-sm">
          <li>Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A Start</li>
          <li>ABBA: A B B A</li>
          <li>Select + Start</li>
        </ul>
      </div>
    </div>
  );
}

