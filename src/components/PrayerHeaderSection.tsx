import mapPinIcon from '../assets/map-pin.svg'
import compassIcon from '../assets/compass.svg'
import settingsIcon from '../assets/settings.svg'
import { getDayDataByDayNumber } from '../utils/prayerUtils'
import type { CalendarDay } from '../services/aladhanService'

interface AppHeaderProps {
  prayerData: CalendarDay[]
  currentTime: Date
  city: string
  country: string
}

export function PrayerHeaderSection({ prayerData, currentTime, city, country }: AppHeaderProps) {
  const currentDay = currentTime.getDate()
  const dayData = getDayDataByDayNumber(prayerData, currentDay)

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
        <button type="button" className="grid h-8 w-8 place-items-center rounded-full" aria-label="Qibla">
          <img src={compassIcon} alt="" aria-hidden="true" className="h-4 w-4" />
        </button>
        <button type="button" className="grid h-8 w-8 place-items-center rounded-full" aria-label="Settings">
          <img src={settingsIcon} alt="" aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
