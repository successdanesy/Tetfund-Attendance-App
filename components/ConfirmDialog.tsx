"use client";

import { useEffect } from "react";
import { Button } from "./Button";

// A single, plain-language confirmation shown before a final/destructive
// action. One dialog at a time - never stacked.
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  confirmVariant = "primary",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[440px] rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-[22px] font-bold text-ink">
          {title}
        </h2>
        <p className="mt-2 text-ink-soft">{message}</p>
        <div className="mt-6 flex flex-col gap-3">
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
