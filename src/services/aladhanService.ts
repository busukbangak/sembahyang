export type CalendarDay = {
  timings: Record<string, string>
  date: {
    gregorian: {
      day: string
      month: {
        en: string
      }
      year: string
    }
    hijri: {
      day: string
      month: {
        en: string
      }
      year: string
    }
  }
}

type CalendarResponse = {
  code: number
  status: string
  data: CalendarDay[]
}

type CalendarRequest = {
  month: number
  year: number
  city: string
  country: string
  method: number
  signal?: AbortSignal
}

export async function fetchCalendarByCity({
  month,
  year,
  city,
  country,
  method,
  signal,
}: CalendarRequest): Promise<CalendarDay[]> {
  const url = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`

  const response = await fetch(url, { signal })
  const result = (await response.json()) as CalendarResponse

  if (!response.ok || result.code !== 200) {
    throw new Error('Unable to fetch prayer data from Aladhan.')
  }

  return result.data
}
