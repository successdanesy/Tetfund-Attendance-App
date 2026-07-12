import { NextResponse } from "next/server";
import { demoLogin } from "@/lib/db";

// Tap-to-enter a demo account. Only works for seeded `isDemo` staff, so real
// accounts are never accessible without their password.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const staffId = body?.staffId as string | undefined;
  if (!staffId) {
    return NextResponse.json({ error: "Missing account." }, { status: 400 });
  }

  const staff = await demoLogin(staffId);
  if (!staff) {
    return NextResponse.json(
      { error: "That demo account isn't available." },
      { status: 404 },
    );
  }
  return NextResponse.json({ staff });
}
