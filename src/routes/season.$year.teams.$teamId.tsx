import {
  Box,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import {
  Outlet,
  createFileRoute,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { ModelRecord } from '@bp1222/stats-api'
import {
  useGamesBehindHistory,
  useSeason,
  useStandings,
  useTeam,
  useTeamSeries,
} from '../api/queries'
import { Above500Chart } from '../components/Above500Chart'
import { GamesBehindChart } from '../components/GamesBehindChart'
import { QueryState } from '../components/QueryState'
import { SeriesBoard } from '../components/SeriesBoard'
import { StandingsTable } from '../components/StandingsTable'
import { SeriesRecordCards } from '../components/SeriesRecordCards'
import { TeamLogo } from '../components/TeamLogo'
import { trackEvent } from '../lib/analytics'
import { localToday, seriesStatsForTeam } from '../lib/series'

export const Route = createFileRoute('/season/$year/teams/$teamId')({
  component: TeamPage,
})

type NarrowTab = 'schedule' | 'stats'

function TeamPage() {
  const { year, teamId: teamIdParam } = Route.useParams()
  const teamId = Number(teamIdParam)
  const navigate = useNavigate()
  const [narrowTab, setNarrowTab] = useState<NarrowTab>('schedule')
  const onRoster = useRouterState({
    select: (s) => s.matches.some((m) => String(m.routeId).includes('/roster')),
  })

  const seasonQuery = useSeason(year)
  const teamQuery = useTeam(year, teamId)
  const seriesQuery = useTeamSeries(year, teamId)
  const leagueId = teamQuery.data?.league?.id
  const standingsQuery = useStandings(year, leagueId)

  const team = teamQuery.data
  const seriesList = seriesQuery.data ?? []
  const seriesStats = seriesStatsForTeam(seriesList, teamId)
  const trackedTeamName = team?.name

  useEffect(() => {
    if (trackedTeamName == null || onRoster) return
    trackEvent({
      name: 'view_team',
      season: year,
      team_name: trackedTeamName,
    })
  }, [year, trackedTeamName, onRoster])

  const divisionId = team?.division?.id
  const divisionRecords: ModelRecord[] = []
  const leagueRecords: ModelRecord[] = []

  for (const block of standingsQuery.data ?? []) {
    leagueRecords.push(...(block.teamRecords ?? []))
    if (divisionId != null && block.division?.id === divisionId) {
      divisionRecords.push(...(block.teamRecords ?? []))
    }
  }

  leagueRecords.sort((a, b) => Number(a.leagueRank) - Number(b.leagueRank))

  const seasonStart = seasonQuery.data?.regularSeasonStartDate ?? `${year}-03-28`
  const seasonEndRaw = seasonQuery.data?.regularSeasonEndDate ?? `${year}-10-01`
  const seasonEnd = seasonEndRaw > localToday() ? localToday() : seasonEndRaw

  const gbHistoryQuery = useGamesBehindHistory({
    year,
    leagueId,
    divisionId: team?.division?.id,
    startDate: seasonQuery.isSuccess ? seasonStart : undefined,
    endDate: seasonQuery.isSuccess ? seasonEnd : undefined,
  })

  // Roster child owns its own loading for the list; still wait on team for the header.
  const isLoading = onRoster
    ? teamQuery.isLoading
    : teamQuery.isLoading || seriesQuery.isLoading
  const isError = onRoster ? teamQuery.isError : teamQuery.isError || seriesQuery.isError
  const error = teamQuery.error ?? seriesQuery.error ?? null

  const useDivisionStandings = team?.division?.id != null && divisionRecords.length > 0

  const statsColumn = (
    <Stack spacing={2}>
      <SeriesRecordCards stats={seriesStats} />

      {standingsQuery.isLoading ? (
        <Typography color="text.secondary">Loading standings…</Typography>
      ) : standingsQuery.isError ? (
        <Typography color="error">
          {standingsQuery.error?.message ?? 'Failed to load standings.'}
        </Typography>
      ) : (
        <>
          {useDivisionStandings && (
            <StandingsTable
              title="Division Standings"
              records={divisionRecords}
              highlightTeamId={teamId}
              gamesBackField="divisionGamesBack"
            />
          )}
          <StandingsTable
            title="League Standings"
            records={leagueRecords}
            highlightTeamId={teamId}
            gamesBackField="leagueGamesBack"
          />
        </>
      )}

      <GamesBehindChart
        title="Games Behind"
        highlightTeamId={teamId}
        history={gbHistoryQuery.data}
        isLoading={
          gbHistoryQuery.isLoading || seasonQuery.isLoading || teamQuery.isLoading
        }
        isError={gbHistoryQuery.isError}
        errorMessage={gbHistoryQuery.error?.message}
      />

      <Above500Chart
        title="Above / Below .500"
        highlightTeamId={teamId}
        history={gbHistoryQuery.data}
        isLoading={
          gbHistoryQuery.isLoading || seasonQuery.isLoading || teamQuery.isLoading
        }
        isError={gbHistoryQuery.isError}
        errorMessage={gbHistoryQuery.error?.message}
      />
    </Stack>
  )

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}
        >
          <Stack
            direction="row"
            sx={{ alignItems: 'center', gap: 2, minWidth: 0, flex: 1 }}
          >
            {team && <TeamLogo teamId={team.id} alt={team.name} size={64} />}
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h3">{team?.name ?? `Team ${teamId}`}</Typography>
              <Typography color="text.secondary">
                {year}
                {team?.division?.name
                  ? ` · ${team.division.name}`
                  : team?.league?.name
                    ? ` · ${team.league.name}`
                    : ''}
              </Typography>
            </Box>
          </Stack>

          {onRoster ? (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                void navigate({
                  to: '/season/$year/teams/$teamId',
                  params: { year, teamId: String(teamId) },
                })
              }}
            >
              Schedule
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                void navigate({
                  to: '/season/$year/teams/$teamId/roster',
                  params: { year, teamId: String(teamId) },
                })
              }}
            >
              Roster
            </Button>
          )}
        </Stack>

        {!onRoster && (
          <>
            {/* Narrow: schedule | stats toggle */}
            <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
              <ToggleButtonGroup
                value={narrowTab}
                exclusive
                fullWidth
                sx={{ mb: 2 }}
                onChange={(_, value: NarrowTab | null) => {
                  if (value != null) setNarrowTab(value)
                }}
              >
                <ToggleButton value="schedule">Schedule</ToggleButton>
                <ToggleButton value="stats">Team stats</ToggleButton>
              </ToggleButtonGroup>
              {narrowTab === 'schedule' ? (
                <SeriesBoard seriesList={seriesList} teamId={teamId} />
              ) : (
                statsColumn
              )}
            </Box>

            {/* Wide: 2 cols series + 1 col stats */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'grid' },
                gridTemplateColumns: '2fr 1fr',
                gap: 2,
                alignItems: 'start',
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <SeriesBoard seriesList={seriesList} teamId={teamId} />
              </Box>
              <Box sx={{ minWidth: 0 }}>{statsColumn}</Box>
            </Box>
          </>
        )}
      </Stack>
      <Outlet />
    </QueryState>
  )
}
