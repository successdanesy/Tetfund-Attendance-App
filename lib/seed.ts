import type { AdminUser, Department } from "./types";

// 5 departments, one pre-seeded admin, and a small roster of staff so the admin
// screens are populated on a fresh database: a few accounts waiting for
// approval, and a few already approved and clocked in for today.
export const SEED_DEPARTMENTS: Department[] = [
  { id: "dep-finance", name: "Finance" },
  { id: "dep-audit", name: "Audit" },
  { id: "dep-servicom", name: "Servicom" },
  { id: "dep-procurement", name: "Procurement" },
  { id: "dep-ri", name: "R&I" },
  { id: "dep-ess", name: "ESS" },
  { id: "dep-deso", name: "DESO" },
  { id: "dep-rd", name: "R&D" },
  { id: "dep-astd", name: "AST&D" },
  { id: "dep-legal", name: "Legal" },
  { id: "dep-public-affairs", name: "Public Affairs" },
  { id: "dep-me", name: "M&E" },
  { id: "dep-spd", name: "SPD" },
  { id: "dep-pi", name: "PI" },
  { id: "dep-hrga", name: "HR&GA" },
  { id: "dep-ict", name: "ICT" },
];

export const SEED_ADMIN: AdminUser = {
  id: "admin-1",
  email: "admin@tetfund.gov.ng",
  name: "System Administrator",
};

// Demo admin password - mock auth only, no real credentials.
export const ADMIN_PASSWORD = "admin";

// Shared password for every seeded staff account, in case you want to sign in
// as one of them manually.
export const SEED_PASSWORD = "demo1234";

// Precomputed bcrypt hashes of the two demo passwords above. Hashing at cost 10
// is deliberately slow (~100ms each); baking the hashes in keeps them out of
// the cold-start seed path so a fresh process doesn't stall on bcrypt.
export const ADMIN_PASSWORD_HASH =
  "$2b$10$NGw0wnFMdA6fHBgaTR9Ob.CeEFEH8Agbl3b39F3cgfu9utH3xRnji";
export const SEED_PASSWORD_HASH =
  "$2b$10$hyhrspq85L32rYQsNBf3PuJ/Z4CCZVaW.mluUxBJZrhhy1yQReCdK";

// Bump when the seed shape changes so an already-seeded database re-seeds. The
// seed marker doc stores this, letting ensureSeed() skip the work in one query.
export const SEED_VERSION = 2;

export type SeedStaff = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  avatarColor: string;
  status: "pending" | "approved";
  // Minutes past 08:00 UTC for a seeded clock-in today. Only approved staff
  // with this set appear on the "Today's attendance" screen.
  clockInMinute?: number;
};

export const SEED_STAFF: SeedStaff[] = [
  // Waiting for approval - these populate the Approvals screen so the admin has
  // accounts to review the moment they sign in.
  {
    id: "staff-seed-ada",
    email: "ada.obi@tetfund.gov.ng",
    firstName: "Ada",
    lastName: "Obi",
    departmentId: "dep-finance",
    avatarColor: "#1b5e3f",
    status: "pending",
  },
  {
    id: "staff-seed-musa",
    email: "musa.bello@tetfund.gov.ng",
    firstName: "Musa",
    lastName: "Bello",
    departmentId: "dep-ict",
    avatarColor: "#8a5a00",
    status: "pending",
  },
  {
    id: "staff-seed-grace",
    email: "grace.eze@tetfund.gov.ng",
    firstName: "Grace",
    lastName: "Eze",
    departmentId: "dep-ri",
    avatarColor: "#3a4a6b",
    status: "pending",
  },
  // Approved and already clocked in today - these populate the Today's
  // attendance screen and give the CSV export something to download.
  {
    id: "staff-seed-ngozi",
    email: "ngozi.okafor@tetfund.gov.ng",
    firstName: "Ngozi",
    lastName: "Okafor",
    departmentId: "dep-hrga",
    avatarColor: "#7a3b6b",
    status: "approved",
    clockInMinute: 5,
  },
  {
    id: "staff-seed-ibrahim",
    email: "ibrahim.sani@tetfund.gov.ng",
    firstName: "Ibrahim",
    lastName: "Sani",
    departmentId: "dep-me",
    avatarColor: "#2a5b6b",
    status: "approved",
    clockInMinute: 22,
  },
  {
    id: "staff-seed-tunde",
    email: "tunde.adeyemi@tetfund.gov.ng",
    firstName: "Tunde",
    lastName: "Adeyemi",
    departmentId: "dep-finance",
    avatarColor: "#8a3b2b",
    status: "approved",
    clockInMinute: 40,
  },
];
