import { Alert, Box, CircularProgress, Paper, Typography } from '@mui/material'
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine'
import { LineChart } from '@mui/x-charts/LineChart'
import type { GamesBehindHistory } from '../api/queries'
import { clinchFootnote, clinchSeriesLabel } from '../lib/clinch'
import { getTeamLineColor } from '../lib/teamColors'

type Above500ChartProps = {
  title: string
  highlightTeamId: number
  history?: GamesBehindHistory
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
}

function formatOver500(value: number | null): string {
  if (value == null) return ''
  if (value > 0) return `+${value}`
  return String(value)
}

export function Above500Chart({
  title,
  highlightTeamId,
  history,
  isLoading,
  isError,
  errorMessage,
}: Above500ChartProps) {
  const points = history?.over500Points ?? []
  const teams = history?.teams ?? []
  const footnote = clinchFootnote(teams.map((t) => t.clinchIndicator))

  const orderedTeams = [
    ...teams.filter((t) => t.teamId !== highlightTeamId),
    ...teams.filter((t) => t.teamId === highlightTeamId),
  ]

  const xDates = points.map((p) => new Date(`${p.date}T12:00:00`))
  const isMonthTick = (date: Date) => date.getDate() === 1

  const series = orderedTeams.map((team) => {
    const highlighted = team.teamId === highlightTeamId
    const clinched = Boolean(team.clinchIndicator || team.clinched)
    return {
      id: `over500-${team.teamId}`,
      label: clinchSeriesLabel(team.abbreviation, team.clinchIndicator),
      data: points.map((p) => p.byTeamId[team.teamId] ?? null),
      color: getTeamLineColor(team.teamId),
      curve: 'linear' as const,
      // End mark for selected/clinched; truthy fn keeps legend/tooltip shapes
      // in sync with hover markers without drawing per-point marks.
      showMark: highlighted || clinched ? ('end' as const) : () => false,
      connectNulls: true,
      valueFormatter: (value: number | null) => formatOver500(value),
    }
  })

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
        {title}
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          {errorMessage ?? 'Failed to load above/below .500 history.'}
        </Alert>
      )}

      {!isLoading && !isError && (points.length === 0 || teams.length === 0) && (
        <Typography color="text.secondary">
          No standings history available yet.
        </Typography>
      )}

      {!isLoading && !isError && points.length > 0 && teams.length > 0 && (
        <Box
          sx={{
            width: '100%',
            [`& [data-series="over500-${highlightTeamId}"]`]: {
              strokeWidth: 3.5,
            },
            '& .MuiLineElement-root': {
              strokeWidth: 2,
            },
            [`& .MuiLineElement-root[data-series="over500-${highlightTeamId}"]`]: {
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
                label: '+/− .500',
                tickLabelStyle: { fontSize: 11 },
                width: 52,
                valueFormatter: (value: number | null) => formatOver500(value),
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
          >
            <ChartsReferenceLine
              y={0}
              label=".500"
              labelAlign="end"
              lineStyle={{ strokeDasharray: '4 4' }}
            />
          </LineChart>
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
