import Image from "next/image";

// The official TETFUND emblem (cropped from the full logo) stands in for the
// wordmark. Compact renders just the circular seal; full adds the app name.
export function Logo({
  compact = false,
  size = 44,
}: {
  compact?: boolean;
  size?: number;
}) {
  const emblem = (
    <Image
      src="/logo-emblem.png"
      alt="TETFUND"
      width={size}
      height={size}
      priority
      style={{ width: size, height: size }}
    />
  );

  if (compact) return emblem;

  return (
    <span className="inline-flex items-center gap-3">
      {emblem}
      <span className="flex flex-col leading-tight">
        <span className="text-[20px] font-bold text-ink">TETFUND</span>
        <span className="text-[16px] text-ink-soft">Staff Attendance</span>
      </span>
    </span>
  );
}
