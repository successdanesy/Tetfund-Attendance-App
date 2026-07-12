"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AdminUser,
  AttendanceRecord,
  Department,
  Staff,
} from "./types";
import { SEED_ADMIN, SEED_DEPARTMENTS } from "./seed";

// ---------------------------------------------------------------------------
// In-memory demo store. No persistence beyond the session (a refresh resets
// everything) — this is deliberate for the pitch.
// ---------------------------------------------------------------------------

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2)}`;
}

export function isSameDay(a: string, b: string): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

// The admin approval gate — real even in the demo.
export function canClockIn(staff: Staff): boolean {
  return staff.status === "approved";
}

export type SignUpInput = {
  email: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  password: string;
  referencePhotoUrl: string;
};

export type SubmitAttendanceInput = {
  staffId: string;
  photoUrl: string;
  latitude: number;
  longitude: number;
  distanceFromOfficeMeters: number;
  withinGeofence: boolean;
  address: string;
};

type StoreValue = {
  departments: Department[];
  staff: Staff[];
  attendance: AttendanceRecord[];
  admin: AdminUser;

  currentStaff: Staff | null;
  currentAdmin: AdminUser | null;

  // Staff auth (mock — password is accepted but not stored/checked hard).
  signUpStaff: (input: SignUpInput) => Staff;
  loginStaff: (email: string) => Staff | null;
  logoutStaff: () => void;

  // Admin auth (mock).
  loginAdmin: () => void;
  logoutAdmin: () => void;

  // Admin actions.
  approveStaff: (staffId: string) => void;
  rejectStaff: (staffId: string) => void;

  // Attendance. Returns null if the approval gate rejects the call.
  submitAttendance: (input: SubmitAttendanceInput) => AttendanceRecord | null;

  // Selectors.
  departmentName: (id: string) => string;
  staffById: (id: string) => Staff | undefined;
  todayRecordForStaff: (staffId: string) => AttendanceRecord | undefined;
  todaysAttendance: () => AttendanceRecord[];
  recordsForStaff: (staffId: string) => AttendanceRecord[];
  pendingStaff: () => Staff[];
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [departments] = useState<Department[]>(SEED_DEPARTMENTS);
  const [admin] = useState<AdminUser>(SEED_ADMIN);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);

  const value = useMemo<StoreValue>(() => {
    const staffById = (id: string) => staff.find((s) => s.id === id);

    return {
      departments,
      staff,
      attendance,
      admin,
      currentStaff,
      currentAdmin,

      signUpStaff: (input) => {
        const created: Staff = {
          id: newId("staff"),
          email: input.email.trim(),
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          departmentId: input.departmentId,
          referencePhotoUrl: input.referencePhotoUrl,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        setStaff((prev) => [...prev, created]);
        return created;
      },

      loginStaff: (email) => {
        const match =
          staff.find(
            (s) => s.email.toLowerCase() === email.trim().toLowerCase(),
          ) ?? null;
        if (match) setCurrentStaff(match);
        return match;
      },

      logoutStaff: () => setCurrentStaff(null),

      loginAdmin: () => setCurrentAdmin(admin),
      logoutAdmin: () => setCurrentAdmin(null),

      approveStaff: (staffId) =>
        setStaff((prev) =>
          prev.map((s) =>
            s.id === staffId ? { ...s, status: "approved" } : s,
          ),
        ),

      rejectStaff: (staffId) =>
        setStaff((prev) =>
          prev.map((s) =>
            s.id === staffId ? { ...s, status: "rejected" } : s,
          ),
        ),

      submitAttendance: (input) => {
        const s = staffById(input.staffId);
        // Enforce the gate in the handler too, not just in the UI.
        if (!s || !canClockIn(s) || !input.withinGeofence) return null;

        const record: AttendanceRecord = {
          id: newId("att"),
          staffId: input.staffId,
          photoUrl: input.photoUrl,
          latitude: input.latitude,
          longitude: input.longitude,
          distanceFromOfficeMeters: input.distanceFromOfficeMeters,
          withinGeofence: input.withinGeofence,
          address: input.address,
          timestamp: new Date().toISOString(),
        };
        setAttendance((prev) => [...prev, record]);
        return record;
      },

      departmentName: (id) =>
        departments.find((d) => d.id === id)?.name ?? "—",

      staffById,

      todayRecordForStaff: (staffId) => {
        const now = new Date().toISOString();
        return attendance.find(
          (r) => r.staffId === staffId && isSameDay(r.timestamp, now),
        );
      },

      todaysAttendance: () => {
        const now = new Date().toISOString();
        return attendance
          .filter((r) => isSameDay(r.timestamp, now))
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      },

      recordsForStaff: (staffId) =>
        attendance
          .filter((r) => r.staffId === staffId)
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp)),

      pendingStaff: () => staff.filter((s) => s.status === "pending"),
    };
  }, [departments, staff, attendance, admin, currentStaff, currentAdmin]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
