// Office location and geofence rules. The centre point, radius, and accuracy
// ceiling are env-overridable (NEXT_PUBLIC_* so both the client check and the
// server check read the same values) - set the exact office coordinate once and
// both sides stay in sync.

function num(value: string | undefined, fallback: number): number {
  const n = value ? Number(value) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

export const OFFICE_LOCATION = {
  // No. 6 Zambezi Crescent, Maitama, Abuja (confirmed coordinate).
  // Override with NEXT_PUBLIC_OFFICE_LAT / _LNG if the office ever moves.
  latitude: num(process.env.NEXT_PUBLIC_OFFICE_LAT, 9.0798462),
  longitude: num(process.env.NEXT_PUBLIC_OFFICE_LNG, 7.490158),
};

// The physical fence. ~60-75m covers a single building and its entrance while
// excluding neighbouring blocks. Lower = stricter (but risks rejecting staff
// deep inside on a weak signal); raise it to loosen.
export const GEOFENCE_RADIUS_METERS = num(
  process.env.NEXT_PUBLIC_GEOFENCE_RADIUS,
  70,
);

// A reading fuzzier than this can't place someone inside the fence with any
// confidence, so we refuse it rather than guess. Raise it to loosen.
export const ACCURACY_MAX_METERS = num(process.env.NEXT_PUBLIC_ACCURACY_MAX, 55);

export function haversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type GeoVerdict = {
  distance: number;
  accuracy: number;
  // The reading is too imprecise to trust at all.
  tooInaccurate: boolean;
  // We are confident the person is inside the fence: even the worst-case point
  // within their accuracy circle (distance + accuracy) still falls inside the
  // radius. This is what stops someone in the vicinity from passing on a fuzzy
  // reading that merely *might* reach the office.
  withinGeofence: boolean;
};

export function checkGeofence(
  lat: number,
  lon: number,
  accuracy = 0,
): GeoVerdict {
  const distance = haversineDistanceMeters(
    lat,
    lon,
    OFFICE_LOCATION.latitude,
    OFFICE_LOCATION.longitude,
  );
  const tooInaccurate = accuracy > ACCURACY_MAX_METERS;
  const withinGeofence =
    !tooInaccurate && distance + accuracy <= GEOFENCE_RADIUS_METERS;
  return { distance, accuracy, tooInaccurate, withinGeofence };
}

// Human-friendly distance for the blocked screen ("about 320 m away").
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}
