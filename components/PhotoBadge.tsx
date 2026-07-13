// Small circular badges that overlap a photo's bottom-right corner. The camera
// badge reinforces "this is a photo"; the pending badge (amber clock) marks a
// record as awaiting review.

// A brand-green camera badge - used on reference/clock-in photos.
export function CameraBadge({ size = 24 }: { size?: number }) {
  const icon = Math.round(size * 0.5);
  return (
    <span
      aria-hidden
      className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full border-2 border-white bg-brand"
      style={{ width: size, height: size }}
    >
      <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none">
        <path
          d="M3 9a2 2 0 012-2h1.6l1.2-2h8.4l1.2 2H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          stroke="#fff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="13" r="3" stroke="#fff" strokeWidth="2" />
      </svg>
    </span>
  );
}

// An amber clock badge - marks an account/record as awaiting review.
export function PendingBadge({ size = 16 }: { size?: number }) {
  const icon = Math.round(size * 0.5);
  return (
    <span
      aria-hidden
      className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full border-2 border-white bg-[color:var(--color-accent)]"
      style={{ width: size, height: size }}
    >
      <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 6v6l4 2"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2.5" />
      </svg>
    </span>
  );
}
