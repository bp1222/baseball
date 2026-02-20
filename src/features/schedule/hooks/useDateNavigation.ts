/**
 * Hook for date navigation in the season series view
 *
 * Provides functions to navigate between dates and game days,
 * with proper clamping to season bounds.
 *
 * The selected date is stored in URL search params for:
 * - Shareable URLs
 * - Browser back/forward navigation
 * - Refresh persistence
 */

import { useLocation, useRouter } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useCallback, useMemo } from 'react'

import { useSeason } from '@/queries/season'

import { useDatesWithGames } from './useDatesWithGames'

type UseDateNavigationResult = {
  /** Currently selected date */
  selectedDate: dayjs.Dayjs
  /** Set the selected date */
  setSelectedDate: (date: dayjs.Dayjs) => void
  /** Navigate to today (clamped to season bounds) */
  goToToday: () => void
  /** Navigate to the next day with games */
  goToNextGameDay: () => void
  /** Navigate to the previous day with games */
  goToPrevGameDay: () => void
  /** Navigate to the next day */
  goToNextDay: () => void
  /** Navigate to the previous day */
  goToPrevDay: () => void
  /** Minimum selectable date (season start) */
  minDate: dayjs.Dayjs
  /** Maximum selectable date (post-season end) */
  maxDate: dayjs.Dayjs
  /** Whether there's a previous game day available */
  hasPrevGameDay: boolean
  /** Whether there's a next game day available */
  hasNextGameDay: boolean
}

export const useDateNavigation = (): UseDateNavigationResult => {
  const { data: season } = useSeason()
  const { sortedDates } = useDatesWithGames()
  const router = useRouter()
  const location = useLocation()

  // Parse date from URL search params
  const searchParams = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return { date: params.get('date') }
  }, [location.search])

  const minDate = useMemo(
    () => dayjs((season as { preSeasonStartDate?: string } | undefined)?.preSeasonStartDate ?? season?.seasonStartDate),
    [season],
  )
  const maxDate = useMemo(() => dayjs(season?.postSeasonEndDate), [season?.postSeasonEndDate])

  // Compute default date: today if within [minDate, maxDate], otherwise clamp to range
  const defaultDate = useMemo(() => {
    const today = dayjs()
    const min = minDate
    const max = maxDate
    if (today.isBefore(min)) return min
    if (today.isAfter(max)) return max
    return today
  }, [minDate, maxDate])

  // Get selected date from URL or use default
  const selectedDate = useMemo(() => {
    if (searchParams.date && dayjs(searchParams.date).isValid()) {
      return dayjs(searchParams.date)
    }
    return defaultDate
  }, [searchParams.date, defaultDate])

  // Update URL when date changes using router history
  const setSelectedDate = useCallback(
    (date: dayjs.Dayjs) => {
      const newSearch = new URLSearchParams(location.search)
      newSearch.set('date', date.format('YYYY-MM-DD'))
      router.history.push(`${location.pathname}?${newSearch.toString()}`)
    },
    [router.history, location.pathname, location.search],
  )

  const goToToday = useCallback(() => {
    const today = dayjs().startOf('day')
    const clamped = today.isBefore(minDate) ? minDate : today.isAfter(maxDate) ? maxDate : today
    setSelectedDate(clamped)
  }, [setSelectedDate, minDate, maxDate])

  const goToNextGameDay = useCallback(() => {
    if (!selectedDate || sortedDates.length === 0) return
    const next = sortedDates.find((d) => d.isAfter(selectedDate.startOf('day')))
    if (next) {
      setSelectedDate(next)
    } else {
      // Fallback: just go to next day
      setSelectedDate(selectedDate.clone().add(1, 'day'))
    }
  }, [setSelectedDate, selectedDate, sortedDates])

  const goToPrevGameDay = useCallback(() => {
    if (!selectedDate || sortedDates.length === 0) return
    const prev = [...sortedDates].reverse().find((d) => d.isBefore(selectedDate.startOf('day')))
    if (prev) {
      setSelectedDate(prev)
    } else {
      // Fallback: just go to previous day
      setSelectedDate(selectedDate.clone().subtract(1, 'day'))
    }
  }, [setSelectedDate, selectedDate, sortedDates])

  const goToNextDay = useCallback(() => {
    setSelectedDate(selectedDate.clone().add(1, 'day'))
  }, [setSelectedDate, selectedDate])

  const goToPrevDay = useCallback(() => {
    setSelectedDate(selectedDate.clone().subtract(1, 'day'))
  }, [setSelectedDate, selectedDate])

  const hasPrevGameDay = useMemo(
    () => sortedDates.some((d) => d.isBefore(selectedDate?.startOf('day'))),
    [sortedDates, selectedDate],
  )

  const hasNextGameDay = useMemo(
    () => sortedDates.some((d) => d.isAfter(selectedDate?.startOf('day'))),
    [sortedDates, selectedDate],
  )

  return {
    selectedDate,
    setSelectedDate,
    goToToday,
    goToNextGameDay,
    goToPrevGameDay,
    goToNextDay,
    goToPrevDay,
    minDate,
    maxDate,
    hasPrevGameDay,
    hasNextGameDay,
  }
}
