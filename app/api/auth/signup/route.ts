import { NextResponse } from "next/server";
import { createStaff, findStaffByEmail } from "@/lib/db";
import { isValidWorkEmail, WORK_EMAIL_ERROR } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const {
    email,
    firstName,
    lastName,
    departmentId,
    password,
    referencePhotoUrl,
  } = body as Record<string, string>;

  if (!email || !email.includes("@") || !isValidWorkEmail(email)) {
    return NextResponse.json({ error: WORK_EMAIL_ERROR }, { status: 400 });
  }
  if (!firstName?.trim() || !lastName?.trim()) {
    return NextResponse.json(
      { error: "Please provide your first and last name." },
      { status: 400 },
    );
  }
  if (!departmentId) {
    return NextResponse.json(
      { error: "Please choose your department." },
      { status: 400 },
    );
  }
  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "Please choose a password of at least 6 characters." },
      { status: 400 },
    );
  }
  if (!referencePhotoUrl) {
    return NextResponse.json(
      { error: "A reference photo is required." },
      { status: 400 },
    );
  }

  const existing = await findStaffByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const staff = await createStaff({
    email,
    firstName,
    lastName,
    departmentId,
    password,
    referencePhotoUrl,
  });
  return NextResponse.json({ staff }, { status: 201 });
}
