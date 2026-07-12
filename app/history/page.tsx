"use client";

import { Screen } from "@/components/Screen";
import { BottomNav } from "@/components/BottomNav";
import { StatusBadge } from "@/components/StatusBadge";
import { Note } from "@/components/Note";
import { useStore } from "@/lib/store";
import { useRequireStaff } from "@/lib/guards";
import { formatDate, formatTime } from "@/lib/format";

export default function HistoryPage() {
  const staff = useRequireStaff();
  const { recordsForStaff } = useStore();

  if (!staff) return null;

  const records = recordsForStaff(staff.id);

  return (
    <>
      <Screen title="History" hasBottomNav>
        <h2 className="mb-5 text-[28px] font-bold leading-tight text-ink">
          Your attendance
        </h2>

        {records.length === 0 ? (
          <Note>
            You haven&apos;t clocked in yet. Once you do, each day will appear
            here.
          </Note>
        ) : (
          <ul className="flex flex-col gap-3">
            {records.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-4 rounded-xl border border-line bg-surface p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.photoUrl}
                  alt="Photo taken when clocking in"
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
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
