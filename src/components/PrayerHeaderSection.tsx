import { useEffect, useState } from 'react'
import mapPinIcon from '../assets/map-pin.svg'
import compassIcon from '../assets/compass.svg'
import settingsIcon from '../assets/settings.svg'
import { getDayDataByDayNumber } from '../utils/prayerUtils'
import type { CalendarDay } from '../services/aladhanService'
import { QiblaFinderModal } from './QiblaFinderModal'
import { SettingsModal } from './SettingsModal'

interface AppHeaderProps {
  prayerData: CalendarDay[]
  currentTime: Date
  city: string
  country: string
}

const QIBLA_COMPASS_KEY = 'sembahyang:qiblaCompassEnabled'

function useQiblaCompassSetting(): [boolean, (enabled: boolean) => void] {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(QIBLA_COMPASS_KEY) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(QIBLA_COMPASS_KEY, String(enabled))
    } catch {
      // Storage unavailable — the toggle still works for this session.
    }
  }, [enabled])

  return [enabled, setEnabled]
}

export function PrayerHeaderSection({ prayerData, currentTime, city, country }: AppHeaderProps) {
  const currentDay = currentTime.getDate()
  const dayData = getDayDataByDayNumber(prayerData, currentDay)
  const [qiblaOpen, setQiblaOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [qiblaCompassEnabled, setQiblaCompassEnabled] = useQiblaCompassSetting()

  return (
    <header className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-1.5">
          <img src={mapPinIcon} alt="" aria-hidden="true" className="h-4 w-4" />
          <p className="text-[30px] font-semibold leading-none tracking-[-0.02em]">{city}, {country}</p>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          {dayData
            ? `${dayData.date.hijri.day}. ${dayData.date.hijri.month.en} ${dayData.date.hijri.year}`
            : 'N/A'}
        </p>
        <p className="text-sm text-slate-500">
          {new Intl.DateTimeFormat('de-DE', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(currentTime)}
        </p>
      </div>
      <div className="mt-0.5 flex gap-1">
        <button
          type="button"
          onClick={() => setQiblaOpen(true)}
          className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-200"
          aria-label="Qibla-Finder öffnen"
        >
          <img src={compassIcon} alt="" aria-hidden="true" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-200"
          aria-label="Einstellungen öffnen"
        >
          <img src={settingsIcon} alt="" aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <QiblaFinderModal
        open={qiblaOpen}
        onClose={() => setQiblaOpen(false)}
        compassEnabled={qiblaCompassEnabled}
        onEnableCompass={() => setQiblaCompassEnabled(true)}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        qiblaCompassEnabled={qiblaCompassEnabled}
        onToggleQiblaCompass={setQiblaCompassEnabled}
      />
    </header>
  )
}