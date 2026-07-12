"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

// A single screen scaffold: a green header with at most a back control and a
// centered content column. Keeps every page visually identical in structure.
export function Screen({
  title,
  onBack,
  hasBottomNav = false,
  children,
}: {
  title?: string;
  onBack?: (() => void) | "history";
  hasBottomNav?: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const back =
    onBack === "history" ? () => router.back() : onBack || undefined;

  return (
    <div className="min-h-dvh bg-white">
      <header className="bg-brand text-white">
        <div className="mx-auto flex min-h-[64px] w-full max-w-[560px] items-center gap-3 px-5">
          {back && (
            <button
              onClick={back}
              aria-label="Go back"
              className="-ml-2 flex h-12 w-12 items-center justify-center rounded-lg text-white hover:bg-brand-dark"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {title && (
            <h1 className="text-[20px] font-bold leading-tight">{title}</h1>
          )}
        </div>
      </header>

      <main
        className={`mx-auto w-full max-w-[560px] px-5 py-7 ${
          hasBottomNav ? "pb-28" : "pb-10"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
