"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "danger" | "accent";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
  // While true the button shows a spinner, disables itself, and can't be
  // double-tapped - immediate feedback that a tap registered.
  loading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
};

// Buttons: 18-20px weight 700, minimum 56px tall, full-width on mobile.
const base =
  "inline-flex items-center justify-center gap-2 min-h-[var(--spacing-touch)] px-6 " +
  "rounded-[var(--radius-card)] font-[family-name:var(--font-heading)] text-[19px] font-bold leading-tight transition-colors " +
  "disabled:opacity-50 disabled:cursor-not-allowed select-none";

const variants: Record<Variant, string> = {
  // Primary stays brand green; the new soft shadow gives it lift.
  primary:
    "bg-brand text-white hover:bg-brand-dark active:bg-brand-dark elevation-primary",
  // Secondary is the amber accent - an outline for standalone actions.
  secondary:
    "bg-white text-[color:var(--color-accent)] border-2 border-[color:var(--color-accent)] hover:bg-surface active:bg-surface",
  danger:
    "bg-white text-[color:var(--color-error-ink)] border-2 border-[color:var(--color-error-ink)] hover:bg-[color:var(--color-error-bg)]",
  // Accent is solid amber for one-off utility actions (e.g. CSV export).
  accent:
    "bg-[color:var(--color-accent)] text-white hover:brightness-95 active:brightness-95 elevation-accent",
};

export function Button({
  variant = "primary",
  fullWidth = true,
  loading = false,
  loadingLabel,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner />}
      {loading ? (loadingLabel ?? children) : children}
    </button>
  );
}
