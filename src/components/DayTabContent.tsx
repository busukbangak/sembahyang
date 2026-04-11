import type { CalendarDay } from '../services/aladhanService'
import { displayPrayerName, getCurrentPrayerName, getDayDataByDayNumber, toCurrentMinutes, toPrayerTimes, type PrayerTime } from '../utils/prayerUtils'

interface DayTabContentProps {
  prayerData: CalendarDay[]
  currentTime: Date
}

export function DayTabContent({ prayerData, currentTime }: DayTabContentProps) {
  const currentDay = currentTime.getDate()
  const dayData = getDayDataByDayNumber(prayerData, currentDay)
  const dayTimes: PrayerTime[] = dayData ? toPrayerTimes(dayData.timings) : []
  const currentPrayerName = getCurrentPrayerName(dayTimes, toCurrentMinutes(currentTime))

  return (
    <section className="mt-4 overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 shadow-[0_8px_22px_-16px_rgba(15,23,42,0.45)]">
      <div className="border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
        Today
      </div>
      <ul className="divide-y divide-slate-200">
        {dayTimes.length > 0 ? (
          dayTimes.map((item) => (
            <li key={item.name} className={`flex items-center justify-between px-5 py-4 text-lg ${item.name === currentPrayerName ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700'}`}>
              <div>
                <p className="font-semibold">{displayPrayerName(item.name)}</p>
              </div>
              <span className={item.name === currentPrayerName ? 'text-emerald-800' : 'text-slate-700'}>
                {item.time}
              </span>
            </li>
          ))
        ) : (
          <li className="px-5 py-4 text-sm text-slate-500">N/A</li>
        )}
      </ul>
    </section>
  )
}
