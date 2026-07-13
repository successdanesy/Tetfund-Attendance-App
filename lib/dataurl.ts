// Turn a stored `data:` URL (base64 JPEG from a real capture, or a URL-encoded
// SVG for seeded avatars) into a cacheable binary image Response, so photos are
// served on their own lazily-loaded, browser-cached request instead of being
// inlined as huge base64 blobs in every list payload.

type Parsed = { body: Buffer; contentType: string };

function parseDataUrl(dataUrl: string): Parsed | null {
  const match = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(dataUrl);
  if (!match) return null;
  const contentType = match[1] || "application/octet-stream";
  const isBase64 = Boolean(match[2]);
  const raw = match[3];
  const body = isBase64
    ? Buffer.from(raw, "base64")
    : Buffer.from(decodeURIComponent(raw), "utf-8");
  return { body, contentType };
}

// `immutable` is safe: a given record's or account's photo never changes once
// written, so the browser can cache it indefinitely.
export function imageResponse(
  dataUrl: string | null | undefined,
): Response {
  if (!dataUrl) return new Response("Not found", { status: 404 });
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(parsed.body), {
    headers: {
      "Content-Type": parsed.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
