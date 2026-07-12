import { NextResponse } from "next/server";
import { getAttendanceById, getStaffById } from "@/lib/db";

// Returns the record plus the matching staff (for the admin side-by-side view).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const record = await getAttendanceById(id);
  if (!record) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const staff = await getStaffById(record.staffId);
  return NextResponse.json({ record, staff });
}
