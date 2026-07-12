// One badge component, one status colour visible at a time — never combining
// success/error/pending on the same view.
type Tone = "success" | "error" | "pending";

const tones: Record<Tone, string> = {
  success: "bg-[color:var(--color-success-bg)] text-[color:var(--color-success-ink)]",
  error: "bg-[color:var(--color-error-bg)] text-[color:var(--color-error-ink)]",
  pending: "bg-[color:var(--color-pending-bg)] text-[color:var(--color-pending-ink)]",
};

export function StatusBadge({
  tone,
  children,
}: {
  tone: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[16px] font-bold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
