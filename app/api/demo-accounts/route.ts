import { NextResponse } from "next/server";
import { listDemoStaff } from "@/lib/db";

export const dynamic = "force-dynamic";

// The tap-to-enter accounts shown on the sign-in screen.
export async function GET() {
  const staff = await listDemoStaff();
  return NextResponse.json({ staff });
}
