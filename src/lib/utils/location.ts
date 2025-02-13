const MAX_DISTANCE_METERS = 100; // Maximum allowed distance in meters

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export function isLocationValid(
  studentLat: number,
  studentLon: number,
  teacherLat: number,
  teacherLon: number,
): boolean {
  const distance = calculateDistance(
    studentLat,
    studentLon,
    teacherLat,
    teacherLon,
  );
  return distance <= MAX_DISTANCE_METERS;
}
