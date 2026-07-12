import type { AdminUser, Department } from "./types";

// 4-5 departments, one pre-seeded admin, zero staff and zero attendance -
// the demo narrative is walking the flow live, not showing a full dashboard.
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

// Pre-approved demo staff so presenters can tap-to-enter instead of signing up.
// These are re-seeded on reset. Real sign-ups still require a password; only
// these `isDemo` accounts can be entered with a tap.
export const DEMO_PASSWORD = "demo1234";

export type SeedStaff = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  avatarColor: string;
};

export const SEED_DEMO_STAFF: SeedStaff[] = [
  {
    id: "staff-demo-ada",
    email: "ada.obi@tetfund.gov.ng",
    firstName: "Ada",
    lastName: "Obi",
    departmentId: "dep-finance",
    avatarColor: "#1b5e3f",
  },
  {
    id: "staff-demo-musa",
    email: "musa.bello@tetfund.gov.ng",
    firstName: "Musa",
    lastName: "Bello",
    departmentId: "dep-ict",
    avatarColor: "#8a5a00",
  },
  {
    id: "staff-demo-grace",
    email: "grace.eze@tetfund.gov.ng",
    firstName: "Grace",
    lastName: "Eze",
    departmentId: "dep-research",
    avatarColor: "#3a4a6b",
  },
];
