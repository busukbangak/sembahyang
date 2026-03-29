import { useEffect, useState } from 'react'

type TimingsResponse = {
  code: number
  status: string
  data: {
    date: {
      readable: string
      hijri: {
        day: string
        month: {
          en: string
        }
        year: string
      }
    }
    timings: {
      Fajr: string
      Sunrise: string
      Dhuhr: string
      Asr: string
      Maghrib: string
      Isha: string
    }
  }
}

function App() {
  const [text, setText] = useState('Loading Aladhan API...')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          'https://api.aladhan.com/v1/timingsByCity?city=Hamburg&country=Germany&method=3',
        )
        const data = (await res.json()) as TimingsResponse

        if (!res.ok || data.code !== 200) {
          throw new Error('API request failed')
        }

        const t = data.data.timings
        const hijri = `${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year}`

        setText(
          [
            `Date: ${data.data.date.readable}`,
            `Hijri: ${hijri}`,
            `Subh: ${t.Fajr}`,
            `Sunrise: ${t.Sunrise}`,
            `Dhuhr: ${t.Dhuhr}`,
            `Asr: ${t.Asr}`,
            `Maghrib: ${t.Maghrib}`,
            `Isha: ${t.Isha}`,
          ].join('\n'),
        )
      } catch {
        setText('Failed to load Aladhan API data.')
      }
    }

    load()
  }, [])

  return (<main>{text}</main>)
}

export default App
