import { Alert, Box, CircularProgress, Paper, Typography } from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'
import type { GamesBehindHistory } from '../api/queries'
import { clinchFootnote, clinchSeriesLabel } from '../lib/clinch'
import { getTeamLineColor } from '../lib/teamColors'

type GamesBehindChartProps = {
  title: string
  highlightTeamId: number
  history?: GamesBehindHistory
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
}

export function GamesBehindChart({
  title,
  highlightTeamId,
  history,
  isLoading,
  isError,
  errorMessage,
}: GamesBehindChartProps) {
  const points = history?.points ?? []
  const teams = history?.teams ?? []
  const scope = history?.scope ?? 'league'
  const footnote = clinchFootnote(teams.map((t) => t.clinchIndicator))

  // Non-highlighted first so the selected team series is drawn last (on top).
  const orderedTeams = [
    ...teams.filter((t) => t.teamId !== highlightTeamId),
    ...teams.filter((t) => t.teamId === highlightTeamId),
  ]

  const xDates = points.map((p) => new Date(`${p.date}T12:00:00`))

  // Only label calendar month starts (1st). Avoids Mar+Apr crowding when
  // the season opens with a couple of late-March days.
  const isMonthTick = (date: Date) => date.getDate() === 1

  const series = orderedTeams.map((team) => {
    const highlighted = team.teamId === highlightTeamId
    const clinched = Boolean(team.clinchIndicator || team.clinched)
    return {
      id: String(team.teamId),
      label: clinchSeriesLabel(team.abbreviation, team.clinchIndicator),
      data: points.map((p) => p.byTeamId[team.teamId] ?? null),
      color: getTeamLineColor(team.teamId),
      curve: 'linear' as const,
      // End mark for selected/clinched; truthy fn keeps legend/tooltip shapes
      // in sync with hover markers without drawing per-point marks.
      showMark: highlighted || clinched ? ('end' as const) : () => false,
      connectNulls: true,
      valueFormatter: (value: number | null) =>
        value == null ? '' : `${value} GB`,
    }
  })

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Games behind the {scope} leader over the season — all {scope} teams
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          {errorMessage ?? 'Failed to load games-behind history.'}
        </Alert>
      )}

      {!isLoading && !isError && (points.length === 0 || teams.length === 0) && (
        <Typography color="text.secondary">No standings history available yet.</Typography>
      )}

      {!isLoading && !isError && points.length > 0 && teams.length > 0 && (
        <Box
          sx={{
            width: '100%',
            // Emphasize the selected team's series stroke
            [`& [data-series="${highlightTeamId}"]`]: {
              strokeWidth: 3.5,
            },
            '& .MuiLineElement-root': {
              strokeWidth: 2,
            },
            [`& .MuiLineElement-root[data-series="${highlightTeamId}"]`]: {
              strokeWidth: 3.5,
            },
            '& .MuiChartsLegend-label': {
              whiteSpace: 'nowrap',
            },
          }}
        >
          <LineChart
            height={340}
            series={series}
            xAxis={[
              {
                data: xDates,
                scaleType: 'point',
                tickInterval: isMonthTick,
                tickLabelInterval: isMonthTick,
                valueFormatter: (date: Date, context) =>
                  context.location === 'tick'
                    ? date.toLocaleDateString('en-US', { month: 'short' })
                    : date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      }),
                tickLabelStyle: { fontSize: 11 },
              },
            ]}
            yAxis={[
              {
                label: 'GB',
                reverse: true,
                min: 0,
                tickLabelStyle: { fontSize: 11 },
                width: 48,
              },
            ]}
            grid={{ horizontal: true }}
            margin={{ top: 16, right: 16, bottom: 24, left: 8 }}
            slotProps={{
              legend: {
                direction: 'horizontal',
                position: { vertical: 'bottom', horizontal: 'center' },
              },
            }}
          />
          {footnote && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 1, textAlign: 'center' }}
            >
              {footnote}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  )
}
