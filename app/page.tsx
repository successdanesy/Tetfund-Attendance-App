"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";

// Welcome — logo, one primary and one secondary action, nothing else.
export default function WelcomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-5">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Logo compact />
          <h1 className="mt-6 text-[30px] font-bold leading-tight text-ink">
            TETFUND Staff Attendance
          </h1>
          <p className="mt-3 max-w-[380px] text-ink-soft">
            Clock in each day with your photo and location — no paper register.
          </p>
        </div>

        <div className="flex flex-col gap-3 pb-10">
          <Link
            href="/login"
            className="flex min-h-[var(--spacing-touch)] w-full items-center justify-center rounded-xl bg-brand px-6 text-[19px] font-bold text-white hover:bg-brand-dark"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="flex min-h-[var(--spacing-touch)] w-full items-center justify-center rounded-xl border-2 border-brand bg-white px-6 text-[19px] font-bold text-brand hover:bg-surface"
          >
            Create account
          </Link>
          <Link
            href="/admin"
            className="mt-2 flex min-h-[48px] w-full items-center justify-center text-[18px] font-bold text-ink-soft hover:text-ink"
          >
            Administrator sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
