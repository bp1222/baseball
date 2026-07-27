import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useSeasonSchedule } from '../api/queries'
import { QueryState } from '../components/QueryState'
import { SeriesDayBoard } from '../components/SeriesDayBoard'
import { trackEvent } from '../lib/analytics'
import { defaultSeasonFocusDate, gameDatesFromSeries } from '../lib/series'

export const Route = createFileRoute('/season/$year/')({
  component: SeasonPage,
})

function SeasonPage() {
  const { year } = Route.useParams()
  const scheduleQuery = useSeasonSchedule(year)
  const gameDates = useMemo(
    () => gameDatesFromSeries(scheduleQuery.data ?? []),
    [scheduleQuery.data],
  )
  const defaultFocus = useMemo(() => defaultSeasonFocusDate(gameDates), [gameDates])

  // undefined → use season default once schedule loads; reset when year changes.
  const [focusDate, setFocusDate] = useState<string | undefined>()
  useEffect(() => {
    setFocusDate(undefined)
  }, [year])

  useEffect(() => {
    trackEvent({ name: 'view_season', season: year })
  }, [year])

  const effectiveFocus = focusDate ?? defaultFocus

  const onFocusDateChange = (date: string) => {
    if (gameDates.length === 0) {
      setFocusDate(date)
      return
    }
    if (date.slice(0, 4) !== year) {
      const first = gameDates[0]!
      const last = gameDates[gameDates.length - 1]!
      setFocusDate(date < first ? first : last)
      return
    }
    setFocusDate(date)
  }

  return (
    <QueryState
      isLoading={scheduleQuery.isLoading || !effectiveFocus}
      isError={scheduleQuery.isError}
      error={scheduleQuery.error}
      isEmpty={!scheduleQuery.isLoading && gameDates.length === 0}
      emptyMessage="No games found for this season."
    >
      {effectiveFocus && (
        <SeriesDayBoard
          focusDate={effectiveFocus}
          onFocusDateChange={onFocusDateChange}
          gameDates={gameDates}
        />
      )}
    </QueryState>
  )
}
