import { NextResponse } from "next/server";
import { getStaffById, setStaffStatus } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const staff = await getStaffById(id);
  if (!staff) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ staff });
}

// Admin approve / reject.
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const action = body?.action as string | undefined;

  if (action !== "approve" && action !== "reject") {
    return NextResponse.json(
      { error: "Unknown action." },
      { status: 400 },
    );
  }

  const staff = await setStaffStatus(
    id,
    action === "approve" ? "approved" : "rejected",
  );
  if (!staff) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ staff });
}
