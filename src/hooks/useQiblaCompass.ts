import { useCallback, useEffect, useRef, useState } from 'react'
import { getDistanceToKaaba, getQiblaBearing } from '../utils/qibla'

export type QiblaCompassStatus =
  | 'idle'
  | 'requesting'
  | 'active'
  | 'unsupported'
  | 'permission-denied'
  | 'location-denied'
  | 'error'

interface CompassLocation {
  lat: number
  lon: number
}

interface PermissiveDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading?: number
}

type DeviceOrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<PermissionState>
}

const PERMISSIVE_DEO = (): DeviceOrientationConstructor | null =>
  typeof window !== 'undefined' && 'DeviceOrientationEvent' in window
    ? (window.DeviceOrientationEvent as DeviceOrientationConstructor)
    : null

/**
 * Live compass + geolocation for the Qibla finder.
 *
 * - iOS 13+ requires `DeviceOrientationEvent.requestPermission()` inside a
 *   user gesture, so callers must invoke `start()` from a click handler.
 * - Heading is taken from `webkitCompassHeading` (iOS Safari) or from an
 *   absolute `alpha` (Android): `heading = 360 - alpha`.
 */
export function useQiblaCompass() {
  const [status, setStatus] = useState<QiblaCompassStatus>('idle')
  const [heading, setHeading] = useState<number | null>(null)
  const [location, setLocation] = useState<CompassLocation | null>(null)
  const [error, setError] = useState<string | null>(null)

  const watchIdRef = useRef<number | null>(null)
  const cleanupFnRef = useRef<(() => void) | null>(null)

  const handleOrientation = useCallback((event: Event) => {
    const ev = event as PermissiveDeviceOrientationEvent

    let nextHeading: number | null = null
    if (typeof ev.webkitCompassHeading === 'number' && Number.isFinite(ev.webkitCompassHeading)) {
      nextHeading = ev.webkitCompassHeading
    } else if (ev.absolute === true && typeof ev.alpha === 'number' && Number.isFinite(ev.alpha)) {
      nextHeading = (360 - ev.alpha) % 360
    }

    setHeading(nextHeading)
  }, [])

  const stop = useCallback(() => {
    cleanupFnRef.current?.()
    cleanupFnRef.current = null

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    setStatus('idle')
    setHeading(null)
    setLocation(null)
    setError(null)
  }, [])

  const start = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('location-denied')
      setError('Dein Browser unterstützt keine Standortermittlung.')
      return
    }

    if (!PERMISSIVE_DEO()) {
      setStatus('unsupported')
      setError('Dein Gerät unterstützt keinen Kompass-Sensor.')
      return
    }

    setStatus('requesting')
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      () => {
        setStatus('location-denied')
        setError('Standort wird benötigt, um die Richtung nach Mekka zu berechnen.')
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    )

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      () => {
        // Silent — `getCurrentPosition` already reported the error state.
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    )

    const ctor = PERMISSIVE_DEO()
    if (!ctor) {
      return
    }

    const bootCompass = () => {
      const onStart = () => {
        window.addEventListener('deviceorientation', handleOrientation, true)
        cleanupFnRef.current = () => {
          window.removeEventListener('deviceorientation', handleOrientation, true)
        }
        setStatus('active')
      }

      if (typeof ctor.requestPermission === 'function') {
        ctor
          .requestPermission()
          .then((state) => {
            if (state === 'granted') {
              onStart()
            } else {
              setStatus('permission-denied')
              setError('Kompass-Berechtigung wurde abgelehnt.')
            }
          })
          .catch(() => {
            setStatus('error')
            setError('Kompass-Berechtigung konnte nicht angefragt werden.')
          })
      } else {
        onStart()
      }
    }

    window.setTimeout(bootCompass, 0)
  }, [handleOrientation])

  useEffect(() => () => stop(), [stop])

  const qiblaBearing = location ? getQiblaBearing(location.lat, location.lon) : null
  const distanceKm = location ? getDistanceToKaaba(location.lat, location.lon) : null

  return { status, heading, location, qiblaBearing, distanceKm, error, start, stop }
}