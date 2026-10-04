import { useState } from 'react'
import type { CalendarDay } from '../services/aladhanService'
import { DayTabContent } from './DayTabContent'
import { WeekTabContent } from './WeekTabContent'
import { MonthTabContent } from './MonthTabContent'

type TabMode = 'day' | 'week' | 'month'

type PrayerTabsSectionProps = {
  prayerData: CalendarDay[]
  currentTime: Date
}

export function PrayerTabsSection({ prayerData, currentTime }: PrayerTabsSectionProps) {
  const [mode, setMode] = useState<TabMode>('day')

  return (
    <>
      <section className="mt-4 rounded-2xl bg-slate-200/90 p-1">
        <div className="grid grid-cols-3 gap-1 text-center text-sm font-semibold">
          <button
            type="button"
            onClick={() => setMode('day')}
            className={`rounded-xl py-2.5 transition ${mode === 'day' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Day
          </button>
          <button
            type="button"
            onClick={() => setMode('week')}
            className={`rounded-xl py-2.5 transition ${mode === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => setMode('month')}
            className={`rounded-xl py-2.5 transition ${mode === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Month
          </button>
        </div>
      </section>

      {mode === 'day' ? <DayTabContent prayerData={prayerData} currentTime={currentTime} /> : null}

      {mode === 'week' ? <WeekTabContent prayerData={prayerData} currentTime={currentTime} /> : null}

      {mode === 'month' ? <MonthTabContent prayerData={prayerData} currentTime={currentTime} /> : null}
    </>
  )
}
