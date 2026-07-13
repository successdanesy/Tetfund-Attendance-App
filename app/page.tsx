"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { LinkButton } from "@/components/LinkButton";
import { hasSeenOnboarding } from "@/lib/onboarding";

// Welcome - logo, one primary and one secondary action, nothing else. First-time
// visitors are sent to the intro carousel before they ever see this.
export default function WelcomePage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!hasSeenOnboarding()) {
      router.replace("/onboarding");
      return;
    }
    setChecked(true);
  }, [router]);

  // Hold the screen blank for the instant the localStorage check takes, so a
  // first-time visitor doesn't see Welcome flash before the carousel.
  if (!checked) return null;

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-5">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          {/* The TETFUND emblem in a soft amber glow - the brand hero mark. */}
          <div className="relative flex h-[132px] w-[132px] items-center justify-center">
            <div
              aria-hidden
              className="pointer-events-none absolute h-[132px] w-[132px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(217,119,6,0.14), rgba(217,119,6,0) 70%)",
              }}
            />
            <Logo compact size={96} />
          </div>
          <h1 className="mt-6 text-[30px] font-bold leading-tight text-ink">
            TETFUND <br /> Staff Attendance
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
