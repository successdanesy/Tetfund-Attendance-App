"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/Button";
import { Note } from "@/components/Note";
import { Spinner } from "@/components/Spinner";
import { StatusBadge } from "@/components/StatusBadge";
import { useRequireAdmin } from "@/lib/guards";
import { api } from "@/lib/api";
import { formatTime } from "@/lib/format";
import { buildAttendanceCsv, downloadCsv } from "@/lib/csv";
import type { AttendanceRecord, Department, Staff } from "@/lib/types";

export default function AttendancePage() {
  const admin = useRequireAdmin();
  const [records, setRecords] = useState<AttendanceRecord[] | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!admin) return;
    let active = true;
    api
      .getAdminToday()
      .then((d) => {
        if (!active) return;
        setRecords(d.records);
        setStaff(d.staff);
        setDepartments(d.departments);
      })
      .catch(
        () =>
          active && setError("We couldn't load today's attendance. Please try again."),
      );
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin?.id]);

  if (!admin) return null;

  const staffById = (id: string) => staff.find((s) => s.id === id);
  const departmentName = (id: string) =>
    departments.find((d) => d.id === id)?.name ?? "—";

  function exportCsv() {
    if (!records) return;
    const csv = buildAttendanceCsv(records, staffById, departmentName);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`tetfund-attendance-${stamp}.csv`, csv);
  }

  return (
    <AdminShell title="Today's attendance">
      {error ? (
        <Note tone="error">{error}</Note>
      ) : !records ? (
        <div className="flex items-center gap-3 text-ink-soft">
          <span className="text-brand">
            <Spinner />
          </span>
          Loading today&apos;s attendance…
        </div>
      ) : records.length === 0 ? (
        <Note>
          No one has clocked in yet today. Records will appear here as staff
          clock in.
        </Note>
      ) : (
        <>
          <div className="mb-5">
            <Button variant="accent" fullWidth={false} onClick={exportCsv}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 3v13m0 0l-5-5m5 5l5-5M4 21h16"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download CSV
            </Button>
          </div>

          {/* Mobile: a tappable card per record, so nothing crowds a phone. */}
          <ul className="flex flex-col gap-3 sm:hidden">
            {records.map((r) => {
              const s = staffById(r.staffId);
              return (
                <li key={r.id}>
                  <Link
                    href={`/admin/attendance/${r.id}`}
                    className="flex items-center gap-3 rounded-[14px] border border-line bg-surface p-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.photoUrl}
                      alt=""
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[17px] font-bold text-ink">
                        {s ? `${s.firstName} ${s.lastName}` : "Unknown"}
                      </p>
                      <p className="truncate text-[15px] text-ink-soft">
                        {s ? departmentName(s.departmentId) : "—"} ·{" "}
                        {formatTime(r.timestamp)}
                      </p>
                    </div>
                    <StatusBadge tone="success">At office</StatusBadge>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Wider screens: the full table. */}
          <div className="hidden overflow-x-auto sm:block">
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
                    <tr key={r.id} className="border-b border-line align-middle">
                      <td className="py-3 pr-4">
                        <Link
                          href={`/admin/attendance/${r.id}`}
                          className="flex items-center gap-3 font-bold text-brand underline underline-offset-2"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={r.photoUrl}
                            alt=""
                            loading="lazy"
                            className="h-12 w-12 shrink-0 rounded-lg object-cover"
                          />
                          <span>
                            {s ? `${s.firstName} ${s.lastName}` : "Unknown"}
                          </span>
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-ink">
                        {s ? departmentName(s.departmentId) : "—"}
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
