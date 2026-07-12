// A plain-language note box. Tone picks exactly one status colour so no screen
// ever shows two status colours at once.
type Tone = "info" | "success" | "error" | "pending";

const tones: Record<Tone, string> = {
  info: "bg-surface text-ink-soft",
  success:
    "bg-[color:var(--color-success-bg)] text-[color:var(--color-success-ink)]",
  error: "bg-[color:var(--color-error-bg)] text-[color:var(--color-error-ink)]",
  pending:
    "bg-[color:var(--color-pending-bg)] text-[color:var(--color-pending-ink)]",
};

export function Note({
  tone = "info",
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl px-5 py-4 text-[18px] ${tones[tone]}`}>
      {children}
    </div>
  );
}
