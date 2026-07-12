// Client-side image helpers. Photos are downscaled and JPEG-compressed to a
// base64 data URL before upload, so they stay small enough to live inside a
// MongoDB document (typically 30-70 KB) and survive refreshes.

const MAX_DIM = 512;
const QUALITY = 0.7;

function drawToDataUrl(
  source: CanvasImageSource,
  srcW: number,
  srcH: number,
): string {
  const scale = Math.min(1, MAX_DIM / Math.max(srcW, srcH));
  const w = Math.round(srcW * scale);
  const h = Math.round(srcH * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.drawImage(source, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", QUALITY);
}

export function videoToDataUrl(video: HTMLVideoElement): string {
  return drawToDataUrl(
    video,
    video.videoWidth || MAX_DIM,
    video.videoHeight || MAX_DIM,
  );
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const out = drawToDataUrl(img, img.naturalWidth, img.naturalHeight);
      URL.revokeObjectURL(url);
      resolve(out);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image."));
    };
    img.src = url;
  });
}
