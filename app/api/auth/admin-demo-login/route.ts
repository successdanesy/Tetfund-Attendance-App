import { NextResponse } from "next/server";
import { ensureSeed } from "@/lib/db";
import { SEED_ADMIN } from "@/lib/seed";

// One-tap admin entry for the demo. There is a single seeded admin.
export async function POST() {
  await ensureSeed();
  return NextResponse.json({
    admin: {
      id: SEED_ADMIN.id,
      email: SEED_ADMIN.email,
      name: SEED_ADMIN.name,
    },
  });
}
