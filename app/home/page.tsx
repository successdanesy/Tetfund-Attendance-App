"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { LinkButton } from "@/components/LinkButton";
import { BottomNav } from "@/components/BottomNav";
import { Note } from "@/components/Note";
import { Stamp } from "@/components/Stamp";
import { Spinner } from "@/components/Spinner";
import { useSession } from "@/lib/session";
import { useRequireStaff } from "@/lib/guards";
import { canClockIn } from "@/lib/access";
import { hasSeenSetup } from "@/lib/onboarding";
import { api } from "@/lib/api";
import { formatTime } from "@/lib/format";
import type { AttendanceRecord } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const staff = useRequireStaff();
  const { refreshStaff } = useSession();
  const [loading, setLoading] = useState(true);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);

  // First visit after approval: run the one-time guided setup before anything
  // else, so the permission primers come ahead of the first clock-in.
  useEffect(() => {
    if (staff && canClockIn(staff) && !hasSeenSetup(staff.id)) {
      router.replace("/setup");
    }
  }, [staff, router]);

  useEffect(() => {
    if (!staff) return;
    let active = true;
    (async () => {
      // Pick up any approval that happened after this device signed in.
      await refreshStaff();
      try {
        const rec = await api.getTodayForStaff(staff.id);
        if (active) setTodayRecord(rec);
      } catch {
        // Leave as no record; the clock-in flow re-checks anyway.
      }
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staff?.id]);

  if (!staff) return null;

  const approved = canClockIn(staff);

  return (
    <>
      <Screen title="Home" hasBottomNav>
        <h2 className="text-[28px] font-bold leading-tight text-ink">
          Hello, {staff.firstName}
        </h2>

        {loading ? (
          <div className="mt-10 flex flex-col items-center gap-4">
            <span className="text-brand">
              <Spinner size={40} />
            </span>
            <p className="text-ink-soft">Checking today&apos;s attendance…</p>
          </div>
        ) : !approved ? (
          <div className="mt-6">
            <Note tone={staff.status === "rejected" ? "error" : "pending"}>
              {staff.status === "rejected" ? (
                <p>
                  Your account wasn&apos;t approved. Please speak to your TETFUND
                  administrator if you think this is a mistake.
                </p>
              ) : (
                <>
                  <p className="font-bold">Your account is awaiting approval.</p>
                  <p className="mt-2">
                    You&apos;ll be able to clock in as soon as your administrator
                    activates your account. Please check back later.
                  </p>
                </>
              )}
            </Note>
          </div>
        ) : todayRecord ? (
          <div className="mt-8 flex flex-col items-center text-center">
            <Stamp />
            <p className="mt-6 text-[22px] font-bold text-ink">
              You&apos;re marked present today
            </p>
            <p className="mt-1 text-ink-soft">
              Clocked in at {formatTime(todayRecord.timestamp)}
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <p className="mb-6 text-ink-soft">
              You haven&apos;t clocked in yet today. When you&apos;re at the
              office, tap below to mark yourself present.
            </p>
            <LinkButton href="/clock-in" size="large">
              Clock in for today
            </LinkButton>
          </div>
        )}
      </Screen>
      <BottomNav />
    </>
  );
}
