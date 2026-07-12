import { NextResponse } from "next/server";
import {
  getRecordsForStaff,
  getTodayForStaff,
  getTodaysAttendance,
  submitAttendance,
} from "@/lib/db";

// GET /api/attendance?scope=today            -> today's records (admin)
// GET /api/attendance?staffId=X              -> all records for a staff member
// GET /api/attendance?staffId=X&scope=today  -> today's record for that staff (or null)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const staffId = searchParams.get("staffId");
  const scope = searchParams.get("scope");

  if (staffId && scope === "today") {
    const record = await getTodayForStaff(staffId);
    return NextResponse.json({ record });
  }
  if (staffId) {
    const records = await getRecordsForStaff(staffId);
    return NextResponse.json({ records });
  }
  const records = await getTodaysAttendance();
  return NextResponse.json({ records });
}

const REASON_STATUS: Record<string, number> = {
  "no-staff": 404,
  "not-approved": 403,
  "outside-geofence": 422,
};

const REASON_MESSAGE: Record<string, string> = {
  "no-staff": "Account not found.",
  "not-approved": "Your account is still awaiting approval.",
  "outside-geofence": "You need to be at the office to clock in.",
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (
    !body ||
    typeof body.staffId !== "string" ||
    typeof body.photoUrl !== "string" ||
    typeof body.latitude !== "number" ||
    typeof body.longitude !== "number"
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = await submitAttendance({
    staffId: body.staffId,
    photoUrl: body.photoUrl,
    latitude: body.latitude,
    longitude: body.longitude,
    address: typeof body.address === "string" ? body.address : "",
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: REASON_MESSAGE[result.reason] },
      { status: REASON_STATUS[result.reason] },
    );
  }
  return NextResponse.json({ record: result.record }, { status: 201 });
}
