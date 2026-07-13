import type { AdminUser, Department } from "./types";

// 5 departments, one pre-seeded admin, and a small roster of staff so the admin
// screens are populated on a fresh database: a few accounts waiting for
// approval, and a few already approved and clocked in for today.
export const SEED_DEPARTMENTS: Department[] = [
  { id: "dep-finance", name: "Finance" },
  { id: "dep-ict", name: "ICT" },
  { id: "dep-research", name: "Research and Innovation" },
  { id: "dep-admin", name: "Administration" },
  { id: "dep-me", name: "Monitoring and Evaluation" },
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
    departmentId: "dep-research",
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
    departmentId: "dep-admin",
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
