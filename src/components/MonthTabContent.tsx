
import type { CalendarDay } from '../services/aladhanService'
import { getCurrentPrayerName, getDayDataByDayNumber, toCurrentMinutes, toWeekdayShort, toPrayerTimes } from '../utils/prayerUtils'
import { useEffect, useMemo, useState } from 'react'
import { getMondayFirstOffset } from '../utils/prayerUtils'
import { PrayerDetailsCard } from './PrayerDetailsCard'

interface MonthTabContentProps {
  prayerData: CalendarDay[]
  currentTime: Date
}


export function MonthTabContent({ prayerData, currentTime }: MonthTabContentProps) {
  const dayInitials = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const currentDay = currentTime.getDate()
  const [selectedDay, setSelectedDay] = useState<number>(currentDay)

  useEffect(() => {
    setSelectedDay(currentDay)
  }, [currentDay])

  const fallbackDay = prayerData[0]
  const selectedData = getDayDataByDayNumber(prayerData, selectedDay) ?? fallbackDay
  const selectedTimes = selectedData ? toPrayerTimes(selectedData.timings) : []
  const isCurrentDaySelected = selectedDay === currentDay
  const currentPrayerName = isCurrentDaySelected ? getCurrentPrayerName(selectedTimes, toCurrentMinutes(currentTime)) : undefined
  const monthLeadingBlanks = useMemo(() => {
    const firstDay = prayerData[0]
    if (!firstDay) return 0

    return getMondayFirstOffset(
      firstDay.date.gregorian.year,
      firstDay.date.gregorian.month.en,
      firstDay.date.gregorian.day,
    )
  }, [prayerData])
  
  return (
    <section className="mt-4 space-y-3">
      <article className="rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-[0_8px_22px_-16px_rgba(15,23,42,0.45)]">
        <div className="mb-4 flex items-center justify-between gap-2">
          <p className="font-medium">
            {fallbackDay ? `${fallbackDay.date.gregorian.month.en} ${fallbackDay.date.gregorian.year}` : 'Month'}
          </p>
          <span className="rounded-full border border-slate-300 px-2 py-0.5 text-xs text-slate-500">
            {fallbackDay ? `${fallbackDay.date.hijri.month.en} ${fallbackDay.date.hijri.year}` : 'Hijri'}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
          {dayInitials.map((label, idx) => (
            <div key={`${label}-${idx}`} className="py-1">{label}</div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-2">
          {Array.from({ length: monthLeadingBlanks }).map((_, idx) => (
            <div key={`blank-${idx}`} aria-hidden="true" />
          ))}
          {prayerData.map((day) => {
            const dayNumber = Number(day.date.gregorian.day)
            const isSelected = dayNumber === selectedDay
            const isCurrentDayCell = dayNumber === currentDay
            return (
              <button
                key={dayNumber}
                type="button"
                onClick={() => setSelectedDay(dayNumber)}
                className={`rounded-2xl border p-2 text-left transition ${isSelected ? 'border-slate-500 bg-slate-100' : isCurrentDayCell ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200 hover:bg-slate-100/70'
                  }`}
              >
                <p className="text-sm font-medium">{dayNumber}</p>
                <p className="mt-1 text-[10px] text-slate-500">{day.date.hijri.day}</p>
              </button>
            )
          })}
        </div>
      </article>
      {selectedData ? (
        <PrayerDetailsCard
          title={toWeekdayShort(
            selectedData.date.gregorian.year,
            selectedData.date.gregorian.month.en,
            selectedData.date.gregorian.day,
          )}
          gregorianLabel={`${selectedData.date.gregorian.day} ${selectedData.date.gregorian.month.en}`}
          hijriLabel={`${selectedData.date.hijri.day} ${selectedData.date.hijri.month.en}`}
          times={selectedTimes}
          isCurrentDay={isCurrentDaySelected}
          currentPrayerName={currentPrayerName}
        />
      ) : null}
    </section>
  )
}
