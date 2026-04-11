import { getCurrentPrayerName, toCurrentMinutes, toPrayerTimes, toWeekdayShort } from '../utils/prayerUtils'
import type { CalendarDay } from '../services/aladhanService'
import { useMemo } from 'react'
import { PrayerDetailsCard } from './PrayerDetailsCard'

interface WeekTabContentProps {
  prayerData: CalendarDay[]
  currentTime: Date
}

export function WeekTabContent({ prayerData, currentTime }: WeekTabContentProps) {
  const weekEntries = useMemo(() => {
    if (prayerData.length === 0) return []

    const toDate = (item: CalendarDay) =>
      new Date(`${item.date.gregorian.month.en} ${item.date.gregorian.day}, ${item.date.gregorian.year}`)

    const dateKey = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    const dayByDate = new Map<string, CalendarDay>()
    for (const item of prayerData) {
      dayByDate.set(dateKey(toDate(item)), item)
    }
    const todayDate = new Date(currentTime)

    const mondayDate = new Date(todayDate)
    const mondayOffset = (mondayDate.getDay() + 6) % 7
    mondayDate.setDate(mondayDate.getDate() - mondayOffset)

    return Array.from({ length: 7 }).map((_, idx) => {
      const date = new Date(mondayDate)
      date.setDate(mondayDate.getDate() + idx)

      const dayData = dayByDate.get(dateKey(date))

      return { date, dayData }
    })
  }, [prayerData, currentTime])

  return (
    <section className="mt-4 space-y-3">
      {weekEntries.map(({ date, dayData }) => {
        const times = dayData ? toPrayerTimes(dayData.timings) : []
        const isCurrentDay = date.toDateString() === currentTime.toDateString()
        const currentPrayerName = isCurrentDay ? getCurrentPrayerName(times, toCurrentMinutes(currentTime)) : undefined
        const dayLabel = dayData
          ? toWeekdayShort(
              dayData.date.gregorian.year,
              dayData.date.gregorian.month.en,
              dayData.date.gregorian.day,
            )
          : new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(date)
        const gregorianLabel = dayData
          ? `${dayData.date.gregorian.day} ${dayData.date.gregorian.month.en}`
          : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' }).format(date)
        const hijriLabel = dayData ? `${dayData.date.hijri.day} ${dayData.date.hijri.month.en}` : undefined

        return (
          <PrayerDetailsCard
            key={date.toISOString()}
            title={dayLabel}
            gregorianLabel={gregorianLabel}
            hijriLabel={hijriLabel}
            times={times}
            emptyMessage="N/A"
            isCurrentDay={isCurrentDay}
            currentPrayerName={currentPrayerName}
          />
        )
      })}
    </section>
  )
}
