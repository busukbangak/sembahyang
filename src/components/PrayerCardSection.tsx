import { useMemo } from 'react'
import { displayPrayerName, getDayDataByDayNumber, toPrayerTimes, type PrayerTime } from '../utils/prayerUtils'
import type { CalendarDay } from '../services/aladhanService'

type DayTimelineCardProps = {
  prayerData: CalendarDay[]
  currentTime: Date
}

export function PrayerCardSection({ prayerData, currentTime }: DayTimelineCardProps) {
  const currentDay = currentTime.getDate()
  const dayData = getDayDataByDayNumber(prayerData, currentDay)
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()

  const dayTimes: PrayerTime[] = useMemo(() => (dayData ? toPrayerTimes(dayData.timings) : []), [dayData])

  const timeline = useMemo(() => {
    if (dayTimes.length === 0) {
      return {
        currentIndex: -1,
        current: null as PrayerTime | null,
        next: null as PrayerTime | null,
        progress: 0,
        startsIn: 0,
      }
    }

    const currentIndex = dayTimes.findLastIndex((item) => item.minutes <= currentMinutes)
    const safeCurrentIndex = currentIndex >= 0 ? currentIndex : dayTimes.length - 1
    const nextIndex = (safeCurrentIndex + 1) % dayTimes.length

    const current = dayTimes[safeCurrentIndex]
    const next = dayTimes[nextIndex]

    const currentStart = current.minutes
    const nextStart = next.minutes <= currentStart ? next.minutes + 24 * 60 : next.minutes
    const nowNormalized = currentMinutes < currentStart ? currentMinutes + 24 * 60 : currentMinutes
    const span = nextStart - currentStart
    const elapsed = nowNormalized - currentStart
    const progress = Math.min(Math.max((elapsed / span) * 100, 0), 100)

    return {
      currentIndex: safeCurrentIndex,
      current,
      next,
      progress,
      startsIn: nextStart - nowNormalized,
    }
  }, [dayTimes, currentMinutes])


  const formatStartsIn = (minutes: number) => {
    const safe = Math.max(0, minutes)
    const h = Math.floor(safe / 60)
    const m = safe % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  return (
    <section className="relative mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-[0_8px_22px_-16px_rgba(15,23,42,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15px_15px,#dfe6ee_1px,transparent_1.5px)] bg-size-[26px_26px] opacity-35" />
      {timeline.current && timeline.next ? (
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">From</p>
              <p className="mt-1 text-[30px] font-semibold leading-none tracking-[-0.02em]">
                {displayPrayerName(timeline.current.name)}
              </p>
              <p className="mt-1 text-base text-slate-600">from {timeline.current.time}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Next</p>
              <p className="mt-1 text-[30px] font-semibold leading-none tracking-[-0.02em]">
                {displayPrayerName(timeline.next.name)}
              </p>
              <p className="mt-1 text-base text-slate-600">at {timeline.next.time}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
              <span>Starts in {formatStartsIn(timeline.startsIn)}</span>
              <span>{displayPrayerName(timeline.next.name)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-200">
              <div className="h-full rounded-full transition-all bg-emerald-500" style={{ width: `${timeline.progress}%` }} />
            </div>
          </div>
        </div>
      ) : <p className="relative text-sm text-slate-500">No prayer times available.</p>}
    </section>
  )
}
