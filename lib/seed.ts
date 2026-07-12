import type { AdminUser, Department } from "./types";

// 4–5 departments, one pre-seeded admin, zero staff and zero attendance —
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

// Demo admin password — mock auth only, no real credentials.
export const ADMIN_PASSWORD = "admin";
