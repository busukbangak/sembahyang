import { useCurrentTime } from './hooks/useCurrentTime'
import { usePrayerAPI } from './hooks/usePrayerAPI'
import { PrayerHeaderSection } from './components/PrayerHeaderSection'
import { PrayerTabsSection } from './components/PrayerTabsSection'
import { PrayerCardSection } from './components/PrayerCardSection'
import { CITY, COUNTRY, METHOD } from './config'


function App() {
  const { currentTime } = useCurrentTime()

  const { prayerData, loading, error } = usePrayerAPI({
    month: currentTime.getMonth() + 1,
    year: currentTime.getFullYear(),
    city: CITY,
    country: COUNTRY,
    method: METHOD
  })

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-5 text-slate-900">
        <div className="mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white/85 p-4 text-sm text-slate-500">
          Loading prayer data...
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen px-4 py-5 text-slate-900">
        <div className="mx-auto max-w-sm rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-5 text-slate-900">
      <div className="mx-auto max-w-sm">
        <PrayerHeaderSection prayerData={prayerData} currentTime={currentTime} city={CITY} country={COUNTRY} />

        <PrayerCardSection prayerData={prayerData} currentTime={currentTime} />

        <PrayerTabsSection prayerData={prayerData} currentTime={currentTime} />
      </div>
    </main>
  )
}

export default App
