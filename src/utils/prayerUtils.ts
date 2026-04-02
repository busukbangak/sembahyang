import type { CalendarDay } from '../services/aladhanService'
import { PRAYER_NAMES } from '../config'

export type PrayerName = (typeof PRAYER_NAMES)[number]

export type PrayerTime = {
  name: PrayerName
  time: string
  minutes: number
}

export const displayPrayerName = (name: PrayerName) => (name === 'Fajr' ? 'Subh' : name)

export function toPrayerTimes(timings: Record<string, string>): PrayerTime[] {
  return PRAYER_NAMES.map((name) => {
    const time = (timings[name] ?? '00:00').split(' ')[0]
    const [h, m] = time.split(':').map(Number)
    return {
      name,
      time,
      minutes: h * 60 + m,
    }
  })
}

export const toWeekdayShort = (year: string, monthName: string, day: string) => {
  const month = new Date(`${monthName} 1, ${year}`).getMonth()
  const dateValue = new Date(Number(year), month, Number(day))
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateValue)
}

export const getMondayFirstOffset = (year: string, monthName: string, day: string) => {
  const jsWeekday = new Date(
    Number(year),
    new Date(`${monthName} 1, ${year}`).getMonth(),
    Number(day),
  ).getDay()

  // Convert JS weekday (0=Sun..6=Sat) to Monday-first index (0=Mon..6=Sun)
  return (jsWeekday + 6) % 7
}

export const getDayDataByDayNumber = (calendarDays: CalendarDay[], dayNumber: number) =>
  calendarDays.find((item) => Number(item.date.gregorian.day) === dayNumber) ?? calendarDays[0]
