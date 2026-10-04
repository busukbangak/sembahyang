export const KAABA = {
  lat: 21.4225,
  lon: 39.8262,
} as const

const EARTH_RADIUS_KM = 6371

const toRad = (deg: number): number => (deg * Math.PI) / 180

/**
 * Great-circle initial bearing from a location towards the Kaaba in Mecca.
 * Returns degrees (0–360, 0 = north, clockwise).
 */
export function getQiblaBearing(lat: number, lon: number): number {
  const phi1 = toRad(lat)
  const phi2 = toRad(KAABA.lat)
  const dLambda = toRad(KAABA.lon - lon)

  const y = Math.sin(dLambda) * Math.cos(phi2)
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda)
  const theta = Math.atan2(y, x)

  return (((theta * 180) / Math.PI) + 360) % 360
}

/** Haversine distance to the Kaaba in kilometres. */
export function getDistanceToKaaba(lat: number, lon: number): number {
  const phi1 = toRad(lat)
  const phi2 = toRad(KAABA.lat)
  const dPhi = phi2 - phi1
  const dLambda = toRad(KAABA.lon - lon)

  const a =
    Math.sin(dPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a))
}

/** Format a distance in kilometres with German thousands separators. */
export function formatKm(km: number): string {
  return `${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(km)} km`
}

/** Compass rotation that makes a relative needle angle point towards a target. */
export function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360
}