import { getAttendancePhoto } from "@/lib/db";
import { imageResponse } from "@/lib/dataurl";

// Serves one attendance record's photo as a cacheable image, so list screens
// can reference it by URL instead of inlining the base64 blob in their payload.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return imageResponse(await getAttendancePhoto(id));
}
