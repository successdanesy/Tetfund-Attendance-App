import type { Staff } from "./types";

// The admin approval gate - shared by client UI and server handlers so the
// rule lives in exactly one place.
export function canClockIn(staff: Pick<Staff, "status">): boolean {
  return staff.status === "approved";
}
