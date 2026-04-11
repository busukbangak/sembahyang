import { displayPrayerName, type PrayerName, type PrayerTime } from '../utils/prayerUtils'

type PrayerDetailsCardProps = {
  title: string
  gregorianLabel: string
  hijriLabel?: string
  times: PrayerTime[]
  sunriseTime?: string
  emptyMessage?: string
  isCurrentDay?: boolean
  currentPrayerName?: PrayerName
}

export function PrayerDetailsCard({
  title,
  gregorianLabel,
  hijriLabel,
  times,
  sunriseTime,
  emptyMessage,
  isCurrentDay,
  currentPrayerName,
}: PrayerDetailsCardProps) {
  return (
    <article className={`rounded-3xl border bg-white/85 p-4 shadow-[0_8px_22px_-16px_rgba(15,23,42,0.45)] ${isCurrentDay ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'}`}>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold">{title}</p>
          {isCurrentDay ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700">Today</span> : null}
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>{gregorianLabel}</p>
          {hijriLabel ? <p>{hijriLabel}</p> : null}
        </div>
      </div>
      <div className="space-y-1.5 text-sm text-slate-600">
        {times.length > 0 ? (
          times.map((item) => (
            <div key={item.name} className={`flex items-center justify-between rounded-md px-2 py-1 ${item.name === currentPrayerName ? 'bg-emerald-50 text-emerald-800' : ''}`}>
              <div>
                <p>{displayPrayerName(item.name)}</p>
              </div>
              <div className="text-right">
                <span className="block leading-tight">{item.time}</span>
                {item.name === 'Fajr' && sunriseTime ? (
                  <p className="text-[10px] leading-tight text-slate-500">Sunrise {sunriseTime}</p>
                ) : null}
              </div>
            </div>
          ))
        ) : emptyMessage ? (
          <p className="text-xs text-slate-500">{emptyMessage}</p>
        ) : null}
      </div>
    </article>
  )
}
