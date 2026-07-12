export const OFFICE_LOCATION = {
  // 6 Zambezi Crescent, Off Aguiyi Ironsi Street, Maitama, Abuja.
  // NOTE: confirm exact coordinates before the live demo.
  latitude: 9.0875,
  longitude: 7.4951,
};

export const GEOFENCE_RADIUS_METERS = 150;

// Above this accuracy radius (in metres) we don't trust the reading and warn
// the user instead — the direct fix for "Abuja showing as Kaduna".
export const ACCURACY_WARN_METERS = 50;

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

export function checkGeofence(lat: number, lon: number) {
  const distance = haversineDistanceMeters(
    lat,
    lon,
    OFFICE_LOCATION.latitude,
    OFFICE_LOCATION.longitude,
  );
  return { withinGeofence: distance <= GEOFENCE_RADIUS_METERS, distance };
}

// Human-friendly distance for the blocked screen ("about 320 m away").
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}
