"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LinkButton } from "@/components/LinkButton";

// Welcome - logo, one primary and one secondary action, nothing else.
export default function WelcomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-5">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Logo compact />
          {/* Decorative location-pin: brand-green pin, amber centre, soft glow. */}
          <div className="relative mt-5 flex h-[120px] w-[120px] items-center justify-center">
            <div
              aria-hidden
              className="pointer-events-none absolute h-[120px] w-[120px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(217,119,6,0.12), rgba(217,119,6,0) 70%)",
              }}
            />
            <svg
              width="86"
              height="86"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="relative"
            >
              <path
                d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"
                stroke="var(--color-brand)"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="9.5"
                r="2.6"
                stroke="var(--color-accent)"
                strokeWidth="1.8"
              />
            </svg>
          </div>
          <h1 className="mt-5 text-[30px] font-bold leading-tight text-ink">
            TETFUND Staff Attendance
          </h1>
          <p className="mt-3 max-w-[380px] text-ink-soft">
            Clock in each day with your photo and location - no paper register.
          </p>
        </div>

        <div className="flex flex-col gap-3 pb-10">
          <LinkButton href="/login">Sign in</LinkButton>
          <LinkButton href="/signup" variant="secondary">
            Create account
          </LinkButton>
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
