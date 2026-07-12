"use client";

import { use } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { Note } from "@/components/Note";
import { StatusBadge } from "@/components/StatusBadge";
import { useStore } from "@/lib/store";
import { useRequireAdmin } from "@/lib/guards";
import { formatDate, formatTime } from "@/lib/format";
import { formatDistance } from "@/lib/geo";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-line py-3">
      <p className="text-[16px] font-bold text-ink-soft">{label}</p>
      <p className="mt-1 text-[18px] text-ink">{value}</p>
    </div>
  );
}

export default function AttendanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const admin = useRequireAdmin();
  const { attendance, staffById, departmentName } = useStore();

  if (!admin) return null;

  const record = attendance.find((r) => r.id === id);
  const staff = record ? staffById(record.staffId) : undefined;

  return (
    <AdminShell title="Attendance detail">
      <Link
        href="/admin/attendance"
        className="mb-5 inline-flex min-h-[48px] items-center text-[18px] font-bold text-brand underline underline-offset-2"
      >
        ← Back to today&apos;s attendance
      </Link>

      {!record || !staff ? (
        <Note tone="error">This record could not be found.</Note>
      ) : (
        <>
          <h2 className="text-[24px] font-bold text-ink">
            {staff.firstName} {staff.lastName}
          </h2>

          {/* Side-by-side photos for a manual visual identity check. */}
          <div className="mt-5 grid grid-cols-2 gap-4">
            <figure>
              <figcaption className="mb-2 text-[16px] font-bold text-ink-soft">
                Reference photo
              </figcaption>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={staff.referencePhotoUrl}
                alt={`Reference photo of ${staff.firstName} ${staff.lastName}`}
                className="aspect-square w-full rounded-xl border border-line object-cover"
              />
            </figure>
            <figure>
              <figcaption className="mb-2 text-[16px] font-bold text-ink-soft">
                Clock-in photo
              </figcaption>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={record.photoUrl}
                alt="Photo taken at clock-in"
                className="aspect-square w-full rounded-xl border border-line object-cover"
              />
            </figure>
          </div>

          <div className="mt-4">
            <StatusBadge tone={record.withinGeofence ? "success" : "error"}>
              {record.withinGeofence ? "Within office geofence" : "Outside geofence"}
            </StatusBadge>
          </div>

          <div className="mt-4">
            <DetailRow label="Department" value={departmentName(staff.departmentId)} />
            <DetailRow label="Email" value={staff.email} />
            <DetailRow label="Date" value={formatDate(record.timestamp)} />
            <DetailRow label="Time" value={formatTime(record.timestamp)} />
            <DetailRow
              label="Distance from office"
              value={formatDistance(record.distanceFromOfficeMeters)}
            />
            <DetailRow label="Location" value={record.address} />
          </div>
        </>
      )}
    </AdminShell>
  );
}
