"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { videoToDataUrl, fileToDataUrl } from "@/lib/image";

type Phase = "starting" | "live" | "captured" | "error";

// Reusable live-photo capture: live preview, one big shutter, preview-before-
// confirm. Falls back to file upload if no camera is available so the demo
// never dead-ends. Hands the caller a downscaled base64 JPEG data URL, which
// persists (unlike an object URL) once stored in the database.
export function CameraCapture({
  onConfirm,
  confirmLabel = "Use this photo",
  facingMode = "user",
}: {
  onConfirm: (photoDataUrl: string) => void;
  confirmLabel?: string;
  facingMode?: "user" | "environment";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [phase, setPhase] = useState<Phase>("starting");
  const [captured, setCaptured] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setPhase("starting");
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setPhase("live");
    } catch {
      setPhase("error");
      setErrorMsg(
        "We couldn't open the camera. Please allow camera access, or upload a photo instead.",
      );
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => stopStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A front-camera ("user") feed is shown mirrored so it behaves like a mirror;
  // bake the same flip into the capture so the saved photo matches the preview.
  const mirrored = facingMode === "user";

  const takePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const url = videoToDataUrl(video, mirrored);
    if (!url) return;
    setCaptured(url);
    setPhase("captured");
    stopStream();
  }, [mirrored, stopStream]);

  const retake = useCallback(() => {
    setCaptured(null);
    startCamera();
  }, [startCamera]);

  const onFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      stopStream();
      try {
        const url = await fileToDataUrl(file);
        setCaptured(url);
        setPhase("captured");
      } catch {
        setPhase("error");
        setErrorMsg("We couldn't read that image. Please try another photo.");
      }
    },
    [stopStream],
  );

  const confirm = useCallback(() => {
    if (captured) onConfirm(captured);
  }, [captured, onConfirm]);

  const frame =
    "relative w-full aspect-square overflow-hidden rounded-2xl bg-surface border border-line";

  if (phase === "captured" && captured) {
    return (
      <div>
        <div className={frame}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={captured}
            alt="Your captured photo"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <Button onClick={confirm}>{confirmLabel}</Button>
          <Button variant="secondary" onClick={retake}>
            Retake photo
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div>
        <div className={`${frame} flex items-center justify-center p-6 text-center`}>
          <p className="text-ink-soft">{errorMsg}</p>
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <Button onClick={startCamera}>Try the camera again</Button>
          <label className="flex min-h-[var(--spacing-touch)] w-full cursor-pointer items-center justify-center rounded-xl border-2 border-brand bg-white px-6 text-[19px] font-bold text-brand hover:bg-surface">
            Upload a photo instead
            <input
              type="file"
              accept="image/*"
              capture="user"
              className="sr-only"
              onChange={onFile}
            />
          </label>
        </div>
      </div>
    );
  }

  // starting / live
  return (
    <div>
      <div className={frame}>
        <video
          ref={videoRef}
          playsInline
          muted
          className="h-full w-full object-cover"
          style={mirrored ? { transform: "scaleX(-1)" } : undefined}
        />
        {phase === "starting" && (
          <div className="absolute inset-0 flex items-center justify-center text-ink-soft">
            Starting camera…
          </div>
        )}
      </div>
      <div className="mt-5">
        <Button onClick={takePhoto} disabled={phase !== "live"}>
          <span aria-hidden className="text-[22px]">◉</span>
          Take photo
        </Button>
      </div>
    </div>
  );
}
