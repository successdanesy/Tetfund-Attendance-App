"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { Stamp } from "@/components/Stamp";
import { useRequireStaff } from "@/lib/guards";
import { canClockIn } from "@/lib/access";
import { markSetupSeen } from "@/lib/onboarding";

// Guided setup - shown once per account, right after approval and before the
// first clock-in. Primes the two browser permissions the clock-in flow needs,
// then confirms. "Not now" advances without prompting; either way the flow is
// marked seen at the end so it never reappears.

const cameraIcon = (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M3 9a2 2 0 012-2h1.6l1.2-2h8.4l1.2 2H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      stroke="var(--color-brand)"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="13" r="3.2" stroke="var(--color-brand)" strokeWidth="1.8" />
  </svg>
);

const locationIcon = (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"
      stroke="var(--color-brand)"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="9.5" r="2.6" stroke="var(--color-accent)" strokeWidth="1.8" />
  </svg>
);

// A flat surface-filled circle behind the permission-primer icons (no glow).
function IconDisc({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-[104px] w-[104px] items-center justify-center">
      <div aria-hidden className="absolute h-[104px] w-[104px] rounded-full bg-surface" />
      <div className="relative">{children}</div>
    </div>
  );
}

export default function SetupPage() {
  const router = useRouter();
  const staff = useRequireStaff();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);

  // Only relevant after approval; a not-yet-approved staff shouldn't land here.
  useEffect(() => {
    if (staff && !canClockIn(staff)) router.replace("/home");
  }, [staff, router]);

  if (!staff) return null;

  async function allowCamera() {
    setBusy(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      // Denied or unavailable - still advance; clock-in re-checks later.
    }
    setBusy(false);
    setStep(1);
  }

  async function allowLocation() {
    setBusy(true);
    await new Promise<void>((resolve) => {
      if (!navigator.geolocation) return resolve();
      navigator.geolocation.getCurrentPosition(
        () => resolve(),
        () => resolve(),
        { timeout: 10000 },
      );
    });
    setBusy(false);
    setStep(2);
  }

  function goHome() {
    markSetupSeen(staff!.id);
    router.replace("/home");
  }

  return (
    <Screen title="Set up your account">
      {step === 0 && (
        <div className="flex min-h-[70dvh] flex-col">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <IconDisc>{cameraIcon}</IconDisc>
            <h1 className="mt-5 text-[20px] font-extrabold leading-[1.3] text-ink">
              Allow camera access
            </h1>
            <p className="mt-3 max-w-[300px] text-[15px] leading-[1.55] text-ink-soft">
              Needed to take your reference photo now, and your daily clock-in
              photo later.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={allowCamera} loading={busy} loadingLabel="Requesting…">
              Allow camera
            </Button>
            <button
              onClick={() => setStep(1)}
              disabled={busy}
              className="min-h-[44px] text-[15px] font-bold text-ink-soft hover:text-ink disabled:opacity-50"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex min-h-[70dvh] flex-col">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <IconDisc>{locationIcon}</IconDisc>
            <h1 className="mt-5 text-[20px] font-extrabold leading-[1.3] text-ink">
              Allow location access
            </h1>
            <p className="mt-3 max-w-[300px] text-[15px] leading-[1.55] text-ink-soft">
              Used only at the moment you clock in, to confirm you&apos;re at the
              office.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={allowLocation} loading={busy} loadingLabel="Requesting…">
              Allow location
            </Button>
            <button
              onClick={() => setStep(2)}
              disabled={busy}
              className="min-h-[44px] text-[15px] font-bold text-ink-soft hover:text-ink disabled:opacity-50"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex min-h-[70dvh] flex-col">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <Stamp size={96} />
            <h1 className="mt-6 text-[21px] font-extrabold leading-[1.3] text-ink">
              You&apos;re all set, {staff.firstName}
            </h1>
            <p className="mt-3 max-w-[300px] text-[15px] leading-[1.55] text-ink-soft">
              Head to Home to take your first clock-in photo.
            </p>
          </div>
          <div>
            <Button onClick={goHome}>Go to Home</Button>
          </div>
        </div>
      )}
    </Screen>
  );
}
