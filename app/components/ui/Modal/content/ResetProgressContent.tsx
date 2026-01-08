export function ResetProgressContent() {
  return (
    <div className="space-y-3">
      <p className="text-rose-200/90">
        Are you sure you want to reset all progress? This will clear all unlocked
        cheats and cannot be undone.
      </p>
      <p className="text-sm text-emerald-100/70">
        Your input log will remain intact.
      </p>
    </div>
  );
}

