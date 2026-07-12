import { NextResponse } from "next/server";
import {
  getDepartments,
  getStaffByIds,
  getTodaysAttendance,
} from "@/lib/db";

export const dynamic = "force-dynamic";

// One call for the admin "today" view: records joined with the staff involved
// and the department list, so the table and CSV can resolve names locally.
export async function GET() {
  const records = await getTodaysAttendance();
  const staffIds = Array.from(new Set(records.map((r) => r.staffId)));
  const [staff, departments] = await Promise.all([
    getStaffByIds(staffIds),
    getDepartments(),
  ]);
  return NextResponse.json({ records, staff, departments });
}
