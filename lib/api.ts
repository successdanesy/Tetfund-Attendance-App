import type {
  AdminUser,
  AttendanceRecord,
  Department,
  Staff,
} from "./types";

// Thin client-side wrappers around the /api route handlers. Every call either
// returns parsed data or throws an ApiError whose message is safe to show.

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
  } catch {
    throw new ApiError(
      "Couldn't reach the server. Please check your connection and try again.",
      0,
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      (data as { error?: string }).error || "Something went wrong.",
      res.status,
    );
  }
  return data as T;
}

export const api = {
  getDepartments: () =>
    request<{ departments: Department[] }>("/api/departments").then(
      (d) => d.departments,
    ),

  signup: (input: {
    email: string;
    firstName: string;
    lastName: string;
    departmentId: string;
    password: string;
    referencePhotoUrl: string;
  }) =>
    request<{ staff: Staff }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    }).then((d) => d.staff),

  login: (email: string, password: string) =>
    request<{ staff: Staff }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }).then((d) => d.staff),

  adminLogin: (email: string, password: string) =>
    request<{ admin: AdminUser }>("/api/auth/admin-login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }).then((d) => d.admin),

  getPending: () =>
    request<{ staff: Staff[] }>("/api/staff/pending").then((d) => d.staff),

  getStaff: (id: string) =>
    request<{ staff: Staff }>(`/api/staff/${id}`).then((d) => d.staff),

  setStaffStatus: (id: string, action: "approve" | "reject") =>
    request<{ staff: Staff }>(`/api/staff/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ action }),
    }).then((d) => d.staff),

  submitAttendance: (input: {
    staffId: string;
    photoUrl: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    address: string;
  }) =>
    request<{ record: AttendanceRecord }>("/api/attendance", {
      method: "POST",
      body: JSON.stringify(input),
    }).then((d) => d.record),

  getTodaysAttendance: () =>
    request<{ records: AttendanceRecord[] }>("/api/attendance?scope=today").then(
      (d) => d.records,
    ),

  getAdminToday: () =>
    request<{
      records: AttendanceRecord[];
      staff: Staff[];
      departments: Department[];
    }>("/api/admin/today"),

  getMyRecords: (staffId: string) =>
    request<{ records: AttendanceRecord[] }>(
      `/api/attendance?staffId=${encodeURIComponent(staffId)}`,
    ).then((d) => d.records),

  getTodayForStaff: (staffId: string) =>
    request<{ record: AttendanceRecord | null }>(
      `/api/attendance?scope=today&staffId=${encodeURIComponent(staffId)}`,
    ).then((d) => d.record),

  getAttendanceDetail: (id: string) =>
    request<{ record: AttendanceRecord; staff: Staff | null }>(
      `/api/attendance/${id}`,
    ),

  resetDemo: () =>
    request<{ ok: true }>("/api/reset", { method: "POST" }),
};
