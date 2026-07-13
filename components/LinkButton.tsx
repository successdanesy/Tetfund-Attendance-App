"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import type { ReactNode } from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary";
type Size = "default" | "large";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark elevation-primary",
  // Secondary is the amber accent outline (e.g. "Create account").
  secondary:
    "border-2 border-[color:var(--color-accent)] bg-white text-[color:var(--color-accent)] hover:bg-surface",
};

const sizes: Record<Size, string> = {
  default: "min-h-[var(--spacing-touch)] text-[19px]",
  large: "min-h-[72px] text-[22px]",
};

// Shows a spinner the moment it's tapped and while the next screen is still
// loading its code - so a slow navigation never looks like a dead tap.
function PendingSpinner() {
  const { pending } = useLinkStatus();
  return pending ? <Spinner /> : null;
}

export function LinkButton({
  href,
  variant = "primary",
  size = "default",
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center justify-center gap-2 rounded-[var(--radius-card)] px-6 font-[family-name:var(--font-heading)] font-bold ${variants[variant]} ${sizes[size]}`}
    >
      <PendingSpinner />
      {children}
    </Link>
  );
}
