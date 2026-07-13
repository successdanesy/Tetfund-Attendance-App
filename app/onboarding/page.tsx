"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { markOnboardingSeen } from "@/lib/onboarding";

// Intro carousel - shown once per device before the Welcome screen. Purely
// informational; sets the "seen" flag on Skip or after the last slide.

type Slide = {
  glow: string;
  icon: ReactNode;
  headline: string;
  body: string;
};

const AMBER_GLOW =
  "radial-gradient(circle, rgba(217,119,6,0.14), rgba(217,119,6,0) 70%)";
const GREEN_GLOW =
  "radial-gradient(circle, rgba(20,107,69,0.1), rgba(20,107,69,0) 70%)";

const slides: Slide[] = [
  {
    glow: AMBER_GLOW,
    icon: (
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 9a2 2 0 012-2h1.6l1.2-2h8.4l1.2 2H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          stroke="var(--color-brand)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="13" r="3.2" stroke="var(--color-brand)" strokeWidth="1.8" />
        <path
          d="M12 22s5-4.4 5-8.5"
          stroke="var(--color-accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    headline: "Clock in with a photo & your location",
    body: "Each morning, take a quick selfie and confirm you're at the office - it takes seconds, no paper register.",
  },
  {
    glow: GREEN_GLOW,
    icon: (
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="4" y="5" width="16" height="15" rx="2" stroke="var(--color-brand)" strokeWidth="1.8" />
        <path d="M4 9.5h16" stroke="var(--color-brand)" strokeWidth="1.8" />
        <path
          d="M8 3v3M16 3v3"
          stroke="var(--color-brand)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M8.5 14l2 2 4-4.5"
          stroke="var(--color-accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    headline: "Your attendance, always visible",
    body: "Every clock-in is saved to your history, so you can always see when you were marked present.",
  },
  {
    glow: AMBER_GLOW,
    icon: (
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"
          stroke="var(--color-brand)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="var(--color-accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    headline: "Your photo & location stay private",
    body: "Only your administrator can see them, for attendance verification. A quick approval from them activates your account first.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const isLast = step === slides.length - 1;
  const slide = slides[step];

  function finish() {
    markOnboardingSeen();
    router.replace("/");
  }

  function next() {
    if (isLast) finish();
    else setStep((s) => s + 1);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-6">
        {/* Skip - kept in the layout on the last slide (hidden) so nothing shifts. */}
        <div className="flex justify-end pt-4">
          <button
            onClick={finish}
            className={`min-h-[44px] px-2 text-[15px] font-bold text-ink-soft hover:text-ink ${
              isLast ? "invisible" : ""
            }`}
          >
            Skip
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
          <div className="relative flex h-[120px] w-[120px] items-center justify-center">
            <div
              aria-hidden
              className="pointer-events-none absolute h-[120px] w-[120px] rounded-full"
              style={{ background: slide.glow }}
            />
            <div className="relative">{slide.icon}</div>
          </div>
          <h1 className="mt-6 text-[21px] font-extrabold leading-[1.3] text-ink">
            {slide.headline}
          </h1>
          <p className="mt-3 max-w-[300px] text-[15px] leading-[1.55] text-ink-soft">
            {slide.body}
          </p>
        </div>

        <div className="flex flex-col gap-4 pb-8">
          {/* Progress dots - active is a wide pill, per the spec. */}
          <div className="flex justify-center gap-1.5" aria-hidden>
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-5 bg-brand" : "w-1.5 bg-line"
                }`}
              />
            ))}
          </div>
          <Button onClick={next}>{isLast ? "Get started" : "Next"}</Button>
        </div>
      </div>
    </div>
  );
}
