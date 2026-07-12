import { NextResponse } from "next/server";
import { listPendingStaff } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const staff = await listPendingStaff();
  return NextResponse.json({ staff });
}
