"use client";

// The signature element: a single circular "present" stamp that draws itself
// in — a deliberate callback to being marked present in a register book. This
// is the only animation in the whole app. Reduced-motion is honoured in CSS.
export function Stamp({ size = 128 }: { size?: number }) {
  const ringLength = 2 * Math.PI * 54; // circle r=54
  const checkLength = 70; // approximate length of the check path

  return (
    <div
      className="stamp-pop"
      style={
        {
          "--ring-length": ringLength,
          "--check-length": checkLength,
        } as React.CSSProperties
      }
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        fill="none"
        role="img"
        aria-label="Marked present"
      >
        <circle
          className="stamp-ring"
          cx="64"
          cy="64"
          r="54"
          stroke="var(--color-brand)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          className="stamp-check"
          d="M42 66l14 14 30-32"
          stroke="var(--color-brand)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
