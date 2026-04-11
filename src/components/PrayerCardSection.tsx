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
  const tomorrowDate = new Date(currentTime)
  tomorrowDate.setDate(currentTime.getDate() + 1)
  const tomorrowData = getDayDataByDayNumber(prayerData, tomorrowDate.getDate())
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()

  const dayTimes: PrayerTime[] = useMemo(() => (dayData ? toPrayerTimes(dayData.timings) : []), [dayData])
  const tomorrowTimes: PrayerTime[] = useMemo(() => (tomorrowData ? toPrayerTimes(tomorrowData.timings) : []), [tomorrowData])

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
    const isWrapToNextDay = nextIndex === 0
    let next: PrayerTime | null = dayTimes[nextIndex]

    const currentStart = current.minutes
    let nextStart = next.minutes <= currentStart ? next.minutes + 24 * 60 : next.minutes

    if (isWrapToNextDay) {
      if (tomorrowTimes.length > 0) {
        next = tomorrowTimes[0]
        nextStart = tomorrowTimes[0].minutes + 24 * 60
      } else {
        next = null
      }
    }

    if (!next) {
      return {
        currentIndex: safeCurrentIndex,
        current,
        next: null as PrayerTime | null,
        progress: 100,
        startsIn: null as number | null,
      }
    }

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
  }, [dayTimes, tomorrowTimes, currentMinutes])


  const formatStartsIn = (minutes: number) => {
    const safe = Math.max(0, minutes)
    const h = Math.floor(safe / 60)
    const m = safe % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  return (
    <section className="relative mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-[0_8px_22px_-16px_rgba(15,23,42,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15px_15px,#dfe6ee_1px,transparent_1.5px)] bg-size-[26px_26px] opacity-35" />
      {timeline.current ? (
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
                {timeline.next ? displayPrayerName(timeline.next.name) : 'N/A'}
              </p>
              <p className="mt-1 text-base text-slate-600">at {timeline.next ? timeline.next.time : 'N/A'}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
              <span>Starts in {timeline.startsIn === null ? 'N/A' : formatStartsIn(timeline.startsIn)}</span>
              <span>{timeline.next ? displayPrayerName(timeline.next.name) : 'N/A'}</span>
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
