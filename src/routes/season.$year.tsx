import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSeasonSchedule } from '../api/queries'
import { QueryState } from '../components/QueryState'
import { SeriesDayBoard } from '../components/SeriesDayBoard'
import { SeasonFocusProvider } from '../context/seasonFocusState'
import { trackEvent } from '../lib/analytics'
import { defaultSeasonFocusDate, gameDatesFromSeries } from '../lib/series'

export const Route = createFileRoute('/season/$year')({
  component: SeasonLayout,
})

function SeasonLayout() {
  const onTeamBranch = useRouterState({
    select: (s) => s.matches.some((m) => String(m.routeId).includes('/teams/')),
  })

  // Team pages (and their game modal children) own the full layout.
  if (onTeamBranch) {
    return <Outlet />
  }

  return <SeasonBoardLayout />
}

function SeasonBoardLayout() {
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

  const onFocusDateChange = useCallback(
    (date: string) => {
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
    },
    [gameDates, year],
  )

  const focusApi = useMemo(
    () => ({ setFocusDate: onFocusDateChange }),
    [onFocusDateChange],
  )

  return (
    <SeasonFocusProvider value={focusApi}>
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
      <Outlet />
    </SeasonFocusProvider>
  )
}
