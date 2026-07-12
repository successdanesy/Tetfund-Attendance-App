"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
  children: ReactNode;
};

// Buttons: 18–20px weight 700, minimum 56px tall, full-width on mobile.
const base =
  "inline-flex items-center justify-center gap-2 min-h-[var(--spacing-touch)] px-6 " +
  "rounded-xl text-[19px] font-bold leading-tight transition-colors " +
  "disabled:opacity-50 disabled:cursor-not-allowed select-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark active:bg-brand-dark",
  secondary:
    "bg-white text-brand border-2 border-brand hover:bg-surface active:bg-surface",
  danger:
    "bg-white text-[color:var(--color-error-ink)] border-2 border-[color:var(--color-error-ink)] hover:bg-[color:var(--color-error-bg)]",
};

export function Button({
  variant = "primary",
  fullWidth = true,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
