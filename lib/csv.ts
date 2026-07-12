import type { AttendanceRecord, Staff } from "./types";

function escape(value: string): string {
  // Wrap in quotes and double any embedded quotes - safe for commas/newlines.
  return `"${value.replace(/"/g, '""')}"`;
}

export function buildAttendanceCsv(
  records: AttendanceRecord[],
  staffById: (id: string) => Staff | undefined,
  departmentName: (id: string) => string,
): string {
  const header = [
    "Name",
    "Department",
    "Email",
    "Date",
    "Time",
    "Latitude",
    "Longitude",
    "Distance from office (m)",
    "Within geofence",
    "Location",
  ];

  const rows = records.map((r) => {
    const s = staffById(r.staffId);
    const d = new Date(r.timestamp);
    const name = s ? `${s.firstName} ${s.lastName}` : "Unknown";
    return [
      name,
      s ? departmentName(s.departmentId) : "-",
      s?.email ?? "-",
      d.toLocaleDateString("en-GB"),
      d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      r.latitude.toFixed(6),
      r.longitude.toFixed(6),
      Math.round(r.distanceFromOfficeMeters).toString(),
      r.withinGeofence ? "Yes" : "No",
      r.address,
    ];
  });

  return [header, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
