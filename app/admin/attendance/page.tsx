"use client";

import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/Button";
import { Note } from "@/components/Note";
import { StatusBadge } from "@/components/StatusBadge";
import { useStore } from "@/lib/store";
import { useRequireAdmin } from "@/lib/guards";
import { formatTime } from "@/lib/format";
import { buildAttendanceCsv, downloadCsv } from "@/lib/csv";

export default function AttendancePage() {
  const admin = useRequireAdmin();
  const { todaysAttendance, staffById, departmentName } = useStore();

  if (!admin) return null;

  const records = todaysAttendance();

  function exportCsv() {
    const csv = buildAttendanceCsv(records, staffById, departmentName);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`tetfund-attendance-${stamp}.csv`, csv);
  }

  return (
    <AdminShell title="Today's attendance">
      {records.length === 0 ? (
        <Note>
          No one has clocked in yet today. Records will appear here as staff
          clock in.
        </Note>
      ) : (
        <>
          <div className="mb-5">
            <Button fullWidth={false} onClick={exportCsv}>
              Download CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line text-[16px] text-ink-soft">
                  <th className="py-3 pr-4 font-bold">Staff</th>
                  <th className="py-3 pr-4 font-bold">Department</th>
                  <th className="py-3 pr-4 font-bold">Time</th>
                  <th className="py-3 font-bold">Location</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => {
                  const s = staffById(r.staffId);
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-line align-middle"
                    >
                      <td className="py-3 pr-4">
                        <Link
                          href={`/admin/attendance/${r.id}`}
                          className="flex items-center gap-3 font-bold text-brand underline underline-offset-2"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={r.photoUrl}
                            alt=""
                            className="h-12 w-12 shrink-0 rounded-lg object-cover"
                          />
                          <span>
                            {s ? `${s.firstName} ${s.lastName}` : "Unknown"}
                          </span>
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-ink">
                        {s ? departmentName(s.departmentId) : "-"}
                      </td>
                      <td className="py-3 pr-4 text-ink">
                        {formatTime(r.timestamp)}
                      </td>
                      <td className="py-3">
                        <StatusBadge tone="success">At office</StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}
