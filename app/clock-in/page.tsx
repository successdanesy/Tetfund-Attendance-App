"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { Note } from "@/components/Note";
import { Stamp } from "@/components/Stamp";
import { CameraCapture } from "@/components/CameraCapture";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { canClockIn } from "@/lib/access";
import { api, ApiError } from "@/lib/api";
import { useRequireStaff } from "@/lib/guards";
import {
  checkGeofence,
  formatDistance,
  OFFICE_LOCATION,
  ACCURACY_WARN_METERS,
} from "@/lib/geo";
import { formatTime } from "@/lib/format";

type Phase =
  | "intro"
  | "locating"
  | "weak"
  | "blocked"
  | "geoerror"
  | "camera"
  | "success";

type Reading = { lat: number; lon: number; accuracy: number };

function MapPin() {
  return (
    <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-surface">
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"
          fill="var(--color-brand)"
        />
        <circle cx="12" cy="10" r="2.6" fill="white" />
      </svg>
    </div>
  );
}

export default function ClockInPage() {
  const router = useRouter();
  const staff = useRequireStaff();

  const [phase, setPhase] = useState<Phase>("intro");
  const [reading, setReading] = useState<Reading | null>(null);
  const [distance, setDistance] = useState(0);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successTime, setSuccessTime] = useState("");

  if (!staff) return null;

  function evaluate(r: Reading) {
    setReading(r);
    const { withinGeofence, distance } = checkGeofence(r.lat, r.lon);
    setDistance(distance);
    if (r.accuracy > ACCURACY_WARN_METERS) {
      setPhase("weak");
    } else if (!withinGeofence) {
      setPhase("blocked");
    } else {
      setPhase("camera");
    }
  }

  function requestLocation() {
    setPhase("locating");
    if (!("geolocation" in navigator)) {
      setPhase("geoerror");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        evaluate({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      () => setPhase("geoerror"),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  // Demo control - pretend we're standing at the office so the happy path is
  // showable during the pitch. The real geofence logic is untouched.
  function simulateOffice() {
    setPhase("locating");
    evaluate({
      lat: OFFICE_LOCATION.latitude,
      lon: OFFICE_LOCATION.longitude,
      accuracy: 8,
    });
  }

  // From the weak-signal screen: trust the reading despite poor accuracy.
  function continueAnyway() {
    if (!reading) return;
    const { withinGeofence } = checkGeofence(reading.lat, reading.lon);
    setPhase(withinGeofence ? "camera" : "blocked");
  }

  function onPhotoConfirmed(photoUrl: string) {
    setPendingPhoto(photoUrl);
    setShowConfirm(true);
  }

  async function doSubmit() {
    if (!reading || !pendingPhoto) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const record = await api.submitAttendance({
        staffId: staff!.id,
        photoUrl: pendingPhoto,
        latitude: reading.lat,
        longitude: reading.lon,
        address: `${reading.lat.toFixed(5)}, ${reading.lon.toFixed(5)}`,
      });
      setShowConfirm(false);
      setSubmitting(false);
      setSuccessTime(record.timestamp);
      setPhase("success");
    } catch (err) {
      setShowConfirm(false);
      setSubmitting(false);
      if (err instanceof ApiError && err.status === 403) {
        // Approval was revoked - the gate rejected it server-side.
        router.replace("/home");
        return;
      }
      if (err instanceof ApiError && err.status === 422) {
        // Server says outside the geofence.
        setPhase("blocked");
        return;
      }
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : "We couldn't record your attendance. Please try again.",
      );
    }
  }

  // Guard: an un-approved staff shouldn't be here at all.
  if (!canClockIn(staff)) {
    return (
      <Screen title="Clock in" onBack={() => router.replace("/home")}>
        <Note tone="pending">
          Your account is still awaiting approval, so you can&apos;t clock in
          yet.
        </Note>
      </Screen>
    );
  }

  return (
    <Screen
      title="Clock in"
      onBack={phase === "success" ? undefined : () => router.replace("/home")}
    >
      {phase === "intro" && (
        <div className="flex flex-col gap-6">
          <MapPin />
          <div>
            <h2 className="text-[26px] font-bold leading-tight text-ink">
              We need to check your location
            </h2>
            <p className="mt-3 text-ink-soft">
              To clock in, the app confirms you&apos;re at the TETFUND office.
              Your phone will ask permission to use your location - please tap
              Allow. We only use it for this check.
            </p>
          </div>
          <Button onClick={requestLocation}>Check my location</Button>
          <button
            onClick={simulateOffice}
            className="min-h-[48px] text-[16px] font-bold text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            Simulate office location (demo)
          </button>
        </div>
      )}

      {phase === "locating" && (
        <div className="flex flex-col items-center gap-6 py-6 text-center">
          <MapPin />
          <p className="text-[22px] font-bold text-ink">
            Checking your location…
          </p>
          <p className="text-ink-soft">This takes a few seconds.</p>
        </div>
      )}

      {phase === "weak" && (
        <div className="flex flex-col gap-6">
          <MapPin />
          <Note tone="pending">
            <p className="font-bold">Your location signal is weak.</p>
            <p className="mt-2">
              The reading is only accurate to about{" "}
              {formatDistance(reading?.accuracy ?? 0)}, which isn&apos;t precise
              enough to trust. Try moving near a window or outside, then check
              again.
            </p>
          </Note>
          <Button onClick={requestLocation}>Check my location again</Button>
          <Button variant="secondary" onClick={continueAnyway}>
            Use this reading anyway
          </Button>
        </div>
      )}

      {phase === "blocked" && (
        <div className="flex flex-col gap-6">
          <MapPin />
          <Note tone="error">
            <p className="font-bold">You&apos;re not at the office.</p>
            <p className="mt-2">
              You need to be at the office to clock in - you appear to be about{" "}
              {formatDistance(distance)} away. Move closer and try again.
            </p>
          </Note>
          <Button onClick={requestLocation}>Try again</Button>
          <button
            onClick={simulateOffice}
            className="min-h-[48px] text-[16px] font-bold text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            Simulate office location (demo)
          </button>
        </div>
      )}

      {phase === "geoerror" && (
        <div className="flex flex-col gap-6">
          <MapPin />
          <Note tone="error">
            <p className="font-bold">We couldn&apos;t get your location.</p>
            <p className="mt-2">
              Please allow location access for this site in your browser, then
              try again.
            </p>
          </Note>
          <Button onClick={requestLocation}>Try again</Button>
          <button
            onClick={simulateOffice}
            className="min-h-[48px] text-[16px] font-bold text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            Simulate office location (demo)
          </button>
        </div>
      )}

      {phase === "camera" && (
        <div className="flex flex-col gap-5">
          {submitError ? (
            <Note tone="error">{submitError}</Note>
          ) : (
            <Note tone="success">
              You&apos;re at the office. Take a photo of yourself to finish
              clocking in.
            </Note>
          )}
          <CameraCapture
            onConfirm={onPhotoConfirmed}
            confirmLabel="Submit attendance"
            facingMode="user"
          />
        </div>
      )}

      {phase === "success" && (
        <div className="flex flex-col items-center py-4 text-center">
          <Stamp />
          <h2 className="mt-6 text-[28px] font-bold text-ink">
            You&apos;re marked present
          </h2>
          <p className="mt-2 text-ink-soft">
            Attendance recorded at {formatTime(successTime)}. Have a good day at
            work.
          </p>
          <div className="mt-8 w-full">
            <Button onClick={() => router.replace("/home")}>Done</Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showConfirm}
        title="Submit your attendance?"
        message="This marks you present for today and can't be undone. Are you ready to submit?"
        confirmLabel="Yes, submit"
        confirmLoading={submitting}
        onConfirm={doSubmit}
        onCancel={() => setShowConfirm(false)}
      />
    </Screen>
  );
}
