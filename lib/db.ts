import "server-only";
import bcrypt from "bcryptjs";
import type { Collection, Document } from "mongodb";
import { getDb } from "./mongodb";
import type {
  AdminUser,
  AttendanceRecord,
  Department,
  Staff,
  StaffStatus,
} from "./types";
import {
  SEED_DEPARTMENTS,
  SEED_ADMIN,
  ADMIN_PASSWORD,
  SEED_DEMO_STAFF,
  DEMO_PASSWORD,
} from "./seed";
import { checkGeofence } from "./geo";
import { canClockIn } from "./access";

// ---------------------------------------------------------------------------
// Data access. Documents use our own string ids stored in `_id`; we map back to
// `id` on the way out and never leak password hashes to the client.
// ---------------------------------------------------------------------------

type StaffDoc = Omit<Staff, "id"> & {
  _id: string;
  passwordHash: string;
  isDemo?: boolean;
};
type AttendanceDoc = Omit<AttendanceRecord, "id"> & { _id: string };
type AdminDoc = Omit<AdminUser, "id"> & { _id: string; passwordHash: string };
type DepartmentDoc = { _id: string; name: string };

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

async function collections() {
  const db = await getDb();
  return {
    departments: db.collection<DepartmentDoc>("departments"),
    staff: db.collection<StaffDoc>("staff"),
    attendance: db.collection<AttendanceDoc>("attendance"),
    admins: db.collection<AdminDoc>("admins"),
  };
}

function toStaff(doc: StaffDoc): Staff {
  const { _id, passwordHash: _hash, isDemo: _demo, ...rest } = doc;
  void _hash;
  void _demo;
  return { id: _id, ...rest };
}

// A simple initials avatar as an inline SVG data URL - used as the reference
// photo for seeded demo staff so they have a face without a real photo.
function avatarDataUrl(
  firstName: string,
  lastName: string,
  bg: string,
): string {
  const initials =
    `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "?";
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>` +
    `<rect width='256' height='256' fill='${bg}'/>` +
    `<text x='50%' y='50%' dy='.35em' text-anchor='middle' ` +
    `font-family='sans-serif' font-size='120' fill='white'>${initials}</text>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function toRecord(doc: AttendanceDoc): AttendanceRecord {
  const { _id, ...rest } = doc;
  return { id: _id, ...rest };
}

// Start of the current UTC day, used to scope "today's" attendance.
function startOfTodayIso(): string {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  ).toISOString();
}

let seeded = false;

// Idempotent seed of departments, admin, and demo staff. Always re-runnable
// (upserts only), so reset can call it to restore the demo accounts.
async function upsertSeed(): Promise<void> {
  const { departments, staff, admins } = await collections();

  await staff.createIndex({ email: 1 }, { unique: true }).catch(() => {});

  await Promise.all(
    SEED_DEPARTMENTS.map((d) =>
      departments.updateOne(
        { _id: d.id },
        { $setOnInsert: { name: d.name } },
        { upsert: true },
      ),
    ),
  );

  await admins.updateOne(
    { _id: SEED_ADMIN.id },
    {
      $setOnInsert: {
        email: SEED_ADMIN.email,
        name: SEED_ADMIN.name,
        passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      },
    },
    { upsert: true },
  );

  const demoHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  await Promise.all(
    SEED_DEMO_STAFF.map((s) =>
      staff.updateOne(
        { _id: s.id },
        {
          $setOnInsert: {
            email: s.email,
            firstName: s.firstName,
            lastName: s.lastName,
            departmentId: s.departmentId,
            referencePhotoUrl: avatarDataUrl(
              s.firstName,
              s.lastName,
              s.avatarColor,
            ),
            passwordHash: demoHash,
            status: "approved",
            isDemo: true,
            createdAt: new Date().toISOString(),
          },
        },
        { upsert: true },
      ),
    ),
  );
}

// Called on every request but does the work only once per process.
export async function ensureSeed(): Promise<void> {
  if (seeded) return;
  await upsertSeed();
  seeded = true;
}

export async function listDemoStaff(): Promise<Staff[]> {
  await ensureSeed();
  const { staff } = await collections();
  const docs = await staff.find({ isDemo: true }).sort({ firstName: 1 }).toArray();
  return docs.map(toStaff);
}

// Enter a demo account with a tap - only permitted for seeded `isDemo` staff,
// so real accounts still require their password.
export async function demoLogin(staffId: string): Promise<Staff | null> {
  const { staff } = await collections();
  const doc = await staff.findOne({ _id: staffId, isDemo: true });
  return doc ? toStaff(doc) : null;
}

export async function getDepartments(): Promise<Department[]> {
  await ensureSeed();
  const { departments } = await collections();
  const docs = await departments.find().sort({ name: 1 }).toArray();
  return docs.map((d) => ({ id: d._id, name: d.name }));
}

export async function findStaffByEmail(
  email: string,
): Promise<StaffDoc | null> {
  const { staff } = await collections();
  return staff.findOne({ email: email.trim().toLowerCase() });
}

export async function getStaffById(id: string): Promise<Staff | null> {
  const { staff } = await collections();
  const doc = await staff.findOne({ _id: id });
  return doc ? toStaff(doc) : null;
}

export type CreateStaffInput = {
  email: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  password: string;
  referencePhotoUrl: string;
};

export async function createStaff(input: CreateStaffInput): Promise<Staff> {
  const { staff } = await collections();
  const doc: StaffDoc = {
    _id: newId("staff"),
    email: input.email.trim().toLowerCase(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    departmentId: input.departmentId,
    referencePhotoUrl: input.referencePhotoUrl,
    passwordHash: await bcrypt.hash(input.password, 10),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await staff.insertOne(doc as Document as StaffDoc);
  return toStaff(doc);
}

export async function getStaffByIds(ids: string[]): Promise<Staff[]> {
  if (ids.length === 0) return [];
  const { staff } = await collections();
  const docs = await staff.find({ _id: { $in: ids } }).toArray();
  return docs.map(toStaff);
}

export async function listPendingStaff(): Promise<Staff[]> {
  const { staff } = await collections();
  const docs = await staff
    .find({ status: "pending" })
    .sort({ createdAt: 1 })
    .toArray();
  return docs.map(toStaff);
}

export async function setStaffStatus(
  id: string,
  status: StaffStatus,
): Promise<Staff | null> {
  const { staff } = await collections();
  await staff.updateOne({ _id: id }, { $set: { status } });
  return getStaffById(id);
}

export async function findAdminByEmail(
  email: string,
): Promise<AdminDoc | null> {
  await ensureSeed();
  const { admins } = await collections();
  return admins.findOne({ email: email.trim().toLowerCase() });
}

export type SubmitAttendanceInput = {
  staffId: string;
  photoUrl: string;
  latitude: number;
  longitude: number;
  address: string;
};

export type SubmitResult =
  | { ok: true; record: AttendanceRecord }
  | { ok: false; reason: "not-approved" | "outside-geofence" | "no-staff" };

// Server is authoritative: it re-checks approval and re-computes the geofence
// from the raw coordinates rather than trusting the client's verdict.
export async function submitAttendance(
  input: SubmitAttendanceInput,
): Promise<SubmitResult> {
  const { attendance } = await collections();
  const staff = await getStaffById(input.staffId);
  if (!staff) return { ok: false, reason: "no-staff" };
  if (!canClockIn(staff)) return { ok: false, reason: "not-approved" };

  const { withinGeofence, distance } = checkGeofence(
    input.latitude,
    input.longitude,
  );
  if (!withinGeofence) return { ok: false, reason: "outside-geofence" };

  const doc: AttendanceDoc = {
    _id: newId("att"),
    staffId: input.staffId,
    photoUrl: input.photoUrl,
    latitude: input.latitude,
    longitude: input.longitude,
    distanceFromOfficeMeters: distance,
    withinGeofence: true,
    address: input.address,
    timestamp: new Date().toISOString(),
  };
  await attendance.insertOne(doc as Document as AttendanceDoc);
  return { ok: true, record: toRecord(doc) };
}

export async function getTodayForStaff(
  staffId: string,
): Promise<AttendanceRecord | null> {
  const { attendance } = await collections();
  const doc = await attendance.findOne({
    staffId,
    timestamp: { $gte: startOfTodayIso() },
  });
  return doc ? toRecord(doc) : null;
}

export async function getTodaysAttendance(): Promise<AttendanceRecord[]> {
  const { attendance } = await collections();
  const docs = await attendance
    .find({ timestamp: { $gte: startOfTodayIso() } })
    .sort({ timestamp: -1 })
    .toArray();
  return docs.map(toRecord);
}

export async function getRecordsForStaff(
  staffId: string,
): Promise<AttendanceRecord[]> {
  const { attendance } = await collections();
  const docs = await attendance
    .find({ staffId })
    .sort({ timestamp: -1 })
    .toArray();
  return docs.map(toRecord);
}

export async function getAttendanceById(
  id: string,
): Promise<AttendanceRecord | null> {
  const { attendance } = await collections();
  const doc = await attendance.findOne({ _id: id });
  return doc ? toRecord(doc) : null;
}

// Wipe staff + attendance, then restore the seeded demo accounts, so a pitch
// can start from a clean slate that still has the tap-to-enter accounts.
export async function resetDemo(): Promise<void> {
  const { staff, attendance } = await collections();
  await Promise.all([staff.deleteMany({}), attendance.deleteMany({})]);
  await upsertSeed();
}
