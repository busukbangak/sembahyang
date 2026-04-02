import type { CalendarDay } from '../services/aladhanService'
import { displayPrayerName, getDayDataByDayNumber, toPrayerTimes, type PrayerTime } from '../utils/prayerUtils'

interface DayTabContentProps {
  prayerData: CalendarDay[]
  currentTime: Date
}

export function DayTabContent({ prayerData, currentTime }: DayTabContentProps) {
  const currentDay = currentTime.getDate()
  const dayData = getDayDataByDayNumber(prayerData, currentDay)
  const dayTimes: PrayerTime[] = dayData ? toPrayerTimes(dayData.timings) : []

  return (
    <section className="mt-4 overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 shadow-[0_8px_22px_-16px_rgba(15,23,42,0.45)]">
      <ul className="divide-y divide-slate-200">
        {dayTimes.map((item) => (
          <li key={item.name} className="flex items-center justify-between px-5 py-4 text-lg text-slate-700">
            <div>
              <p className="font-semibold">{displayPrayerName(item.name)}</p>
            </div>
            <span className="text-slate-700">
              {item.time}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
