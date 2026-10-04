import { useMemo } from 'react'
import { displayPrayerName, getDayDataByDayNumber, getSunriseTime, timeStringToMinutes, toPrayerTimes, type PrayerTime } from '../utils/prayerUtils'
import type { CalendarDay } from '../services/aladhanService'

type DayTimelineCardProps = {
  prayerData: CalendarDay[]
  currentTime: Date
}

export function PrayerCardSection({ prayerData, currentTime }: DayTimelineCardProps) {
  const currentDay = currentTime.getDate()
  const dayData = getDayDataByDayNumber(prayerData, currentDay)
  const sunriseTime = dayData ? getSunriseTime(dayData.timings) : undefined
  const sunriseMinutes = sunriseTime ? timeStringToMinutes(sunriseTime) : null
  const tomorrowDate = new Date(currentTime)
  tomorrowDate.setDate(currentTime.getDate() + 1)
  const tomorrowData = getDayDataByDayNumber(prayerData, tomorrowDate.getDate())
  const yesterdayDate = new Date(currentTime)
  yesterdayDate.setDate(currentTime.getDate() - 1)
  const yesterdayData = getDayDataByDayNumber(prayerData, yesterdayDate.getDate())
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()

  const dayTimes: PrayerTime[] = useMemo(() => (dayData ? toPrayerTimes(dayData.timings) : []), [dayData])
  const tomorrowTimes: PrayerTime[] = useMemo(() => (tomorrowData ? toPrayerTimes(tomorrowData.timings) : []), [tomorrowData])
  const yesterdayTimes: PrayerTime[] = useMemo(() => (yesterdayData ? toPrayerTimes(yesterdayData.timings) : []), [yesterdayData])
  const isSunriseGap =
    sunriseMinutes != null &&
    dayTimes[1] !== undefined &&
    currentMinutes >= sunriseMinutes &&
    currentMinutes < dayTimes[1].minutes

  const timeline = useMemo(() => {
    if (dayTimes.length === 0) {
      return {
        current: null as PrayerTime | null,
        next: null as PrayerTime | null,
        nextLabel: null as string | null,
        nextTime: null as string | null,
        progress: 0,
        startsIn: 0,
      }
    }

    const currentIndex = dayTimes.findLastIndex((item) => item.minutes <= currentMinutes)
    const safeCurrentIndex = currentIndex >= 0 ? currentIndex : dayTimes.length - 1
    const nextIndex = (safeCurrentIndex + 1) % dayTimes.length
    const fajr = dayTimes[0]
    const isPreFajr = fajr?.name === 'Fajr' && currentMinutes < fajr.minutes

    let current = dayTimes[safeCurrentIndex]
    const isWrapToNextDay = nextIndex === 0
    let next: PrayerTime | null = dayTimes[nextIndex]
    let nextLabel = next ? displayPrayerName(next.name) : null as string | null
    let nextTime = next ? next.time : null as string | null

    let currentStart = current.minutes
    let nextStart = next.minutes <= currentStart ? next.minutes + 24 * 60 : next.minutes

    if (isPreFajr) {
      const yesterdayIsha = yesterdayTimes.find((item) => item.name === 'Isha')
      if (yesterdayIsha) {
        current = yesterdayIsha
        currentStart = yesterdayIsha.minutes
      }

      next = fajr
      nextLabel = displayPrayerName(fajr.name)
      nextTime = fajr.time
      nextStart = fajr.minutes + 24 * 60
    }

    const isBetweenSunriseAndDhuhr =
      sunriseMinutes != null &&
      current.name === 'Fajr' &&
      dayTimes[1] !== undefined &&
      currentMinutes >= sunriseMinutes &&
      currentMinutes < dayTimes[1].minutes

    if (isBetweenSunriseAndDhuhr) {
      const dhuhr = dayTimes[1]
      const sunriseStart = sunriseMinutes
      return {
        current: null as PrayerTime | null,
        next: dhuhr,
        nextLabel: displayPrayerName(dhuhr.name),
        nextTime: dhuhr.time,
        progress: Math.min(Math.max(((currentMinutes - sunriseStart) / (dhuhr.minutes - sunriseStart)) * 100, 0), 100),
        startsIn: dhuhr.minutes - currentMinutes,
      }
    }

    // Subh period should lead to sunrise, not directly to Dhuhr.
    if (current.name === 'Fajr' && sunriseMinutes != null && sunriseTime) {
      next = null
      nextLabel = 'Sunrise'
      nextTime = sunriseTime
      nextStart = sunriseMinutes <= currentStart ? sunriseMinutes + 24 * 60 : sunriseMinutes
    }

    if (isWrapToNextDay && current.name !== 'Fajr' && !isPreFajr) {
      if (tomorrowTimes.length > 0) {
        next = tomorrowTimes[0]
        nextLabel = displayPrayerName(tomorrowTimes[0].name)
        nextTime = tomorrowTimes[0].time
        nextStart = tomorrowTimes[0].minutes + 24 * 60
      } else {
        next = null
        nextLabel = null
        nextTime = null
      }
    }

    if (!next && !nextLabel) {
      return {
        current,
        next,
        nextLabel: null as string | null,
        nextTime: null as string | null,
        progress: 100,
        startsIn: null as number | null,
      }
    }

    const nowNormalized = currentMinutes < currentStart ? currentMinutes + 24 * 60 : currentMinutes
    const span = nextStart - currentStart
    const elapsed = nowNormalized - currentStart
    const progress = Math.min(Math.max((elapsed / span) * 100, 0), 100)

    return {
      current,
      next,
      nextLabel,
      nextTime,
      progress,
      startsIn: nextStart - nowNormalized,
    }
  }, [dayTimes, tomorrowTimes, yesterdayTimes, currentMinutes, sunriseMinutes, sunriseTime])


  const formatStartsIn = (minutes: number) => {
    const safe = Math.max(0, minutes)
    const h = Math.floor(safe / 60)
    const m = safe % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  return (
    <section className="relative mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 p-5 shadow-[0_8px_22px_-16px_rgba(15,23,42,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15px_15px,#dfe6ee_1px,transparent_1.5px)] bg-size-[26px_26px] opacity-35" />
      {timeline.current || timeline.nextLabel ? (
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Now</p>
              {timeline.current ? (
                <>
                  <p className="mt-1 text-[30px] font-semibold leading-none tracking-[-0.02em]">
                    {displayPrayerName(timeline.current.name)}
                  </p>
                  <p className="mt-1 text-base text-slate-600">from {timeline.current.time}</p>
                </>
              ) : isSunriseGap && sunriseTime ? (
                <>
                  <p className="mt-1 text-[30px] font-semibold leading-none tracking-[-0.02em]">Sunrise</p>
                  <p className="mt-1 text-base text-slate-600">from {sunriseTime}</p>
                </>
              ) : (
                <>
                  <p className="mt-1 text-[30px] font-semibold leading-none tracking-[-0.02em]">No current prayer</p>
                  <p className="mt-1 text-base text-slate-600">after sunrise</p>
                </>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                {timeline.current?.name === 'Fajr' && timeline.nextLabel === 'Sunrise' ? 'Until' : 'Next'}
              </p>
              <p className="mt-1 text-[30px] font-semibold leading-none tracking-[-0.02em]">
                {timeline.nextLabel ?? 'N/A'}
              </p>
              <p className="mt-1 text-base text-slate-600">at {timeline.nextTime ?? 'N/A'}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
              <span>Starts in {timeline.startsIn === null ? 'N/A' : formatStartsIn(timeline.startsIn)}</span>
              <span>{timeline.nextLabel ?? 'N/A'}</span>
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
