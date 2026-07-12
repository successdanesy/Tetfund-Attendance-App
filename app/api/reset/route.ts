import { NextResponse } from "next/server";
import { resetDemo, ensureSeed } from "@/lib/db";

// Clears all staff + attendance and re-seeds, so a pitch starts clean.
export async function POST() {
  await resetDemo();
  await ensureSeed();
  return NextResponse.json({ ok: true });
}
