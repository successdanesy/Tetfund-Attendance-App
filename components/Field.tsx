"use client";

import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

const controlBase =
  "w-full min-h-[var(--spacing-touch)] rounded-xl border border-line bg-surface px-4 text-[18px] text-ink placeholder:text-ink-soft focus:border-brand";

export function TextField({
  label,
  error,
  hint,
  id,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
}) {
  const fieldId = id || rest.name;
  return (
    <div>
      <label htmlFor={fieldId} className="mb-2 block text-[18px] font-bold text-ink">
        {label}
      </label>
      {hint && <p className="mb-2 text-[16px] text-ink-soft">{hint}</p>}
      <input
        id={fieldId}
        className={`${controlBase} ${error ? "border-[color:var(--color-error-ink)]" : ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...rest}
      />
      {error && (
        <p
          id={`${fieldId}-error`}
          className="mt-2 rounded-lg bg-[color:var(--color-error-bg)] px-3 py-2 text-[16px] font-medium text-[color:var(--color-error-ink)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function SelectField({
  label,
  children,
  id,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: ReactNode;
}) {
  const fieldId = id || rest.name;
  return (
    <div>
      <label htmlFor={fieldId} className="mb-2 block text-[18px] font-bold text-ink">
        {label}
      </label>
      <select id={fieldId} className={controlBase} {...rest}>
        {children}
      </select>
    </div>
  );
}
