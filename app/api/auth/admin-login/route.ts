import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findAdminByEmail } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = body?.email as string | undefined;
  const password = body?.password as string | undefined;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Please enter your email and password." },
      { status: 400 },
    );
  }

  const doc = await findAdminByEmail(email);
  const ok = doc && (await bcrypt.compare(password, doc.passwordHash));
  if (!doc || !ok) {
    return NextResponse.json(
      { error: "That email or password isn't correct." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    admin: { id: doc._id, email: doc.email, name: doc.name },
  });
}
