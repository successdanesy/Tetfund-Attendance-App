// Simple, legible wordmark stands in for the official TETFUND logo asset.
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span
        aria-hidden
        className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand text-white text-[20px] font-bold"
      >
        TF
      </span>
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span className="text-[20px] font-bold text-ink">TETFUND</span>
          <span className="text-[16px] text-ink-soft">Staff Attendance</span>
        </span>
      )}
    </span>
  );
}
