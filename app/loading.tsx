import { Spinner } from "@/components/Spinner";

// Shown automatically while a route's code loads on navigation. It only
// appears when a screen is actually slow, so it never flashes on instant moves.
export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white">
      <span className="text-brand">
        <Spinner size={44} />
      </span>
      <p className="text-[18px] text-ink-soft">Loading…</p>
    </div>
  );
}
