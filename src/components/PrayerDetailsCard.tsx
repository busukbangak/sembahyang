import { displayPrayerName, type PrayerTime } from '../utils/prayerUtils'

type PrayerDetailsCardProps = {
  title: string
  gregorianLabel: string
  hijriLabel?: string
  times: PrayerTime[]
  emptyMessage?: string
}

export function PrayerDetailsCard({
  title,
  gregorianLabel,
  hijriLabel,
  times,
  emptyMessage,
}: PrayerDetailsCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-[0_8px_22px_-16px_rgba(15,23,42,0.45)]">
      <div className="mb-4 flex items-start justify-between">
        <p className="text-lg font-semibold">{title}</p>
        <div className="text-right text-xs text-slate-500">
          <p>{gregorianLabel}</p>
          {hijriLabel ? <p>{hijriLabel}</p> : null}
        </div>
      </div>
      <div className="space-y-1.5 text-sm text-slate-600">
        {times.length > 0 ? (
          times.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div>
                <p>{displayPrayerName(item.name)}</p>
              </div>
              <span>{item.time}</span>
            </div>
          ))
        ) : emptyMessage ? (
          <p className="text-xs text-slate-500">{emptyMessage}</p>
        ) : null}
      </div>
    </article>
  )
}
