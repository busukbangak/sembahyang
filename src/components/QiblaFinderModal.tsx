import { useEffect } from 'react'
import { useQiblaCompass } from '../hooks/useQiblaCompass'
import { formatKm, normalizeDegrees } from '../utils/qibla'

interface QiblaFinderModalProps {
  open: boolean
  onClose: () => void
  compassEnabled: boolean
  onEnableCompass: () => void
}

const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => {
  const rad = (deg * Math.PI) / 180
  return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)]
}

const CARDINALS = [
  { label: 'N', angle: 0 },
  { label: 'E', angle: 90 },
  { label: 'S', angle: 180 },
  { label: 'W', angle: 270 },
] as const

function CompassDial({
  rotation,
  qiblaBearing,
}: {
  rotation: number
  qiblaBearing: number | null
}) {
  const ticks = Array.from({ length: 24 }, (_, i) => i * 15)

  return (
    <svg
      viewBox="0 0 200 200"
      className="h-64 w-64 select-none"
      role="img"
      aria-label="Kompass"
    >
      <circle cx="100" cy="100" r="96" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="100" cy="100" r="88" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />

      <g transform={`rotate(${rotation} 100 100)`}>
        {ticks.map((angle) => {
          const major = angle % 30 === 0
          const [x1, y1] = polar(100, 100, major ? 72 : 78, angle)
          const [x2, y2] = polar(100, 100, 84, angle)
          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#94a3b8"
              strokeWidth={major ? 1.8 : 1}
            />
          )
        })}

        {CARDINALS.map(({ label, angle }) => {
          const [x, y] = polar(100, 100, 60, angle)
          return (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="16"
              fontWeight="700"
              fill="#334155"
            >
              {label}
            </text>
          )
        })}

        {qiblaBearing !== null && (
          <g transform={`rotate(${qiblaBearing} 100 100)`}>
            <path d="M100 22 L107 72 L100 58 L93 72 Z" fill="#dc2626" />
          </g>
        )}
      </g>

      {/* Fixed index marker: top of the device */}
      <path d="M100 2 L94 12 L106 12 Z" fill="#0f172a" />

      <circle cx="100" cy="100" r="5" fill="#dc2626" />
    </svg>
  )
}

export function QiblaFinderModal({
  open,
  onClose,
  compassEnabled,
  onEnableCompass,
}: QiblaFinderModalProps) {
  const { status, heading, qiblaBearing, distanceKm, error, start, stop } = useQiblaCompass()

  useEffect(() => {
    if (!open || !compassEnabled) {
      return
    }
    start()
    return () => stop()
  }, [open, compassEnabled, start, stop])

  if (!open) {
    return null
  }

  const liveHeading = compassEnabled && status === 'active' ? heading : null
  const rotation = liveHeading !== null ? -liveHeading : 0
  const relative =
    qiblaBearing !== null && liveHeading !== null
      ? normalizeDegrees(qiblaBearing - liveHeading)
      : null
  const aligned = relative !== null && (relative <= 6 || relative >= 354)
  const turnDelta = relative !== null && !aligned ? (relative <= 180 ? relative : relative - 360) : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Qibla-Finder</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center gap-4">
          <CompassDial rotation={rotation} qiblaBearing={qiblaBearing} />

          {!compassEnabled ? (
            <div className="w-full rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-600">
                Mit dem Live-Kompass zeigt dir die rote Nadel immer direkt nach Mekka.
              </p>
              <button
                type="button"
                onClick={onEnableCompass}
                className="mt-3 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Kompass aktivieren
              </button>
            </div>
          ) : status === 'location-denied' ? (
            <p className="w-full rounded-xl bg-rose-50 p-4 text-center text-sm text-rose-700">
              {error}
            </p>
          ) : qiblaBearing === null ? (
            <p className="text-sm text-slate-500">Standort wird ermittelt…</p>
          ) : status === 'idle' || status === 'requesting' ? (
            <button
              type="button"
              onClick={start}
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Kompass starten
            </button>
          ) : status === 'permission-denied' || status === 'unsupported' ? (
            <div className="w-full rounded-xl bg-amber-50 p-4 text-center text-sm text-amber-800">
              <p>{error}</p>
              <p className="mt-2 text-slate-600">
                Halte das Gerät so, dass <span className="font-semibold">N oben</span> liegt —
                die rote Nadel zeigt Richtung Mekka.
              </p>
            </div>
          ) : liveHeading === null ? (
            <p className="text-center text-sm text-slate-500">
              Kompass kalibriert sich… Halte das Gerät waagerecht und bewege es leicht in einer 8.
            </p>
          ) : (
            <div className="w-full rounded-xl bg-slate-50 p-4 text-center">
              {aligned ? (
                <p className="text-base font-semibold text-emerald-700">✓ In Richtung Mekka 🕋</p>
              ) : (
                <p className="text-base font-semibold text-slate-800">
                  Drehe {Math.round(Math.abs(turnDelta ?? 0))}° nach{' '}
                  {turnDelta !== null && turnDelta > 0 ? 'rechts' : 'links'}
                </p>
              )}
              <div className="mt-2 flex items-center justify-center gap-4 text-sm text-slate-600">
                <span>
                  Qibla <span className="font-semibold text-rose-600">{Math.round(qiblaBearing)}°</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Gerät <span className="font-semibold text-slate-800">{Math.round(liveHeading)}°</span>
                </span>
              </div>
              {distanceKm !== null && (
                <p className="mt-2 text-xs text-slate-500">≈ {formatKm(distanceKm)} bis zur Kaaba</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}