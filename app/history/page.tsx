"use client";

import { useEffect, useState } from "react";
import { Screen } from "@/components/Screen";
import { BottomNav } from "@/components/BottomNav";
import { StatusBadge } from "@/components/StatusBadge";
import { CameraBadge } from "@/components/PhotoBadge";
import { Note } from "@/components/Note";
import { Spinner } from "@/components/Spinner";
import { useRequireStaff } from "@/lib/guards";
import { api } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/format";
import type { AttendanceRecord } from "@/lib/types";

export default function HistoryPage() {
  const staff = useRequireStaff();
  const [records, setRecords] = useState<AttendanceRecord[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!staff) return;
    let active = true;
    api
      .getMyRecords(staff.id)
      .then((r) => active && setRecords(r))
      .catch(
        () => active && setError("We couldn't load your history. Please try again."),
      );
    return () => {
      active = false;
    };
  }, [staff?.id]);

  if (!staff) return null;

  return (
    <>
      <Screen title="History" hasBottomNav>
        <h2 className="mb-5 text-[28px] font-bold leading-tight text-ink">
          Your attendance
        </h2>

        {error ? (
          <Note tone="error">{error}</Note>
        ) : !records ? (
          <div className="flex items-center gap-3 text-ink-soft">
            <span className="text-brand">
              <Spinner />
            </span>
            Loading your history…
          </div>
        ) : records.length === 0 ? (
          <Note>
            You haven&apos;t clocked in yet. Once you do, each day will appear
            here.
          </Note>
        ) : (
          <ul className="flex flex-col gap-3">
            {records.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-3 elevation-card"
              >
                <div className="relative h-16 w-16 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.photoUrl}
                    alt="Photo taken when clocking in"
                    loading="lazy"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <CameraBadge size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[18px] font-bold text-ink">
                    {formatDate(r.timestamp)}
                  </p>
                  <p className="text-[16px] text-ink-soft">
                    Clocked in at {formatTime(r.timestamp)}
                  </p>
                </div>
                <StatusBadge tone="success">Present</StatusBadge>
              </li>
            ))}
          </ul>
        )}
      </Screen>
      <BottomNav />
    </>
  );
}
