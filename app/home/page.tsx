"use client";

import Link from "next/link";
import { Screen } from "@/components/Screen";
import { BottomNav } from "@/components/BottomNav";
import { Note } from "@/components/Note";
import { Stamp } from "@/components/Stamp";
import { useStore, canClockIn } from "@/lib/store";
import { useRequireStaff } from "@/lib/guards";
import { formatTime } from "@/lib/format";

export default function HomePage() {
  const staff = useRequireStaff();
  const { todayRecordForStaff } = useStore();

  if (!staff) return null;

  const approved = canClockIn(staff);
  const todayRecord = todayRecordForStaff(staff.id);

  return (
    <>
      <Screen title="Home" hasBottomNav>
        <h2 className="text-[28px] font-bold leading-tight text-ink">
          Hello, {staff.firstName}
        </h2>

        {!approved && (
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
        )}

        {approved && todayRecord && (
          <div className="mt-8 flex flex-col items-center text-center">
            <Stamp />
            <p className="mt-6 text-[22px] font-bold text-ink">
              You&apos;re marked present today
            </p>
            <p className="mt-1 text-ink-soft">
              Clocked in at {formatTime(todayRecord.timestamp)}
            </p>
          </div>
        )}

        {approved && !todayRecord && (
          <div className="mt-8">
            <p className="mb-6 text-ink-soft">
              You haven&apos;t clocked in yet today. When you&apos;re at the
              office, tap below to mark yourself present.
            </p>
            <Link
              href="/clock-in"
              className="flex min-h-[72px] w-full items-center justify-center rounded-2xl bg-brand px-6 text-[22px] font-bold text-white hover:bg-brand-dark"
            >
              Clock in for today
            </Link>
          </div>
        )}
      </Screen>
      <BottomNav />
    </>
  );
}
