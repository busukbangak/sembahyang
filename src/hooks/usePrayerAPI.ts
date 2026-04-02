import { useEffect, useState } from 'react'
import { fetchCalendarByCity, type CalendarDay } from '../services/aladhanService'

type UsePrayerAPIArgs = {
    month: number
    year: number
    city: string
    country: string
    method: number
}

type UsePrayerAPIResult = {
    prayerData: CalendarDay[]
    loading: boolean
    error: string
}

export function usePrayerAPI({ month, year, city, country, method }: UsePrayerAPIArgs): UsePrayerAPIResult {
    const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const controller = new AbortController()

        const loadCalendar = async () => {
            try {
                setLoading(true)
                setError('')

                const currentDays = await fetchCalendarByCity({ month, year, city, country, method, signal: controller.signal })
                setCalendarDays(currentDays)
            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') return
                setError('Could not load prayer data. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        loadCalendar()

        return () => controller.abort()
    }, [month, year, city, country, method])

    return { prayerData: calendarDays, loading, error }
}
