/**
 * TeamSeriesRecord - Displays series record statistics for a team
 *
 * Shows wins, losses, ties, winning percentage, last 10 results, and streak.
 * Uses the useSeriesStats hook for data calculation.
 */

import { Alert, Box, Button, Grid, Typography } from '@mui/material'

import LabelPaper from '@/components/Shared/LabelPaper'
import { useSeriesStats } from './hooks/useSeriesStats'
import { Team } from '@/types/Team'

import { SeriesRecordSkeleton } from './SeriesRecordSkeleton'

type TeamSeriesRecordProps = {
  team: Team
}

export const TeamSeriesRecord = ({ team }: TeamSeriesRecordProps) => {
  const { wins, losses, ties, pct, last10, streak, isPending, isError, refetch } = useSeriesStats(team)

  if (isPending) {
    return <SeriesRecordSkeleton />
  }

  if (isError) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Alert severity="error">Unable to load series record. Check back later or try again.</Alert>
        <Button variant="contained" size="small" onClick={() => void refetch()}>
          Retry
        </Button>
      </Box>
    )
  }

  return (
    <LabelPaper label="Series Record">
      <Grid container flexDirection="column" sx={{ minWidth: 0 }} gap={1.5}>
        {/* W/L/T stat row */}
        <Grid container columns={3} justifyContent="center" textAlign="center">
          <Grid size={1}>
            <Typography variant="h4" fontWeight={700} color="success.main">
              {wins}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Wins
            </Typography>
          </Grid>
          <Grid size={1}>
            <Typography variant="h4" fontWeight={700} color="error.main">
              {losses}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Losses
            </Typography>
          </Grid>
          <Grid size={1}>
            <Typography variant="h4" fontWeight={700} color="text.secondary">
              {ties}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ties
            </Typography>
          </Grid>
        </Grid>

        {/* Winning percentage */}
        {!isNaN(pct) && (
          <Typography variant="body2" textAlign="center" color="text.secondary">
            <Box component="span" fontWeight={700} color="text.primary">
              {pct === 1 ? pct.toFixed(3) : pct.toFixed(3).substring(1)}
            </Box>{' '}
            series win pct
          </Typography>
        )}

        {/* Last 10 and streak */}
        {(last10.length > 0 || streak) && (
          <Box
            sx={{
              pt: 1,
              borderTop: 1,
              borderColor: 'divider',
              textAlign: 'center',
            }}
          >
            {last10.length > 0 && (
              <Typography variant="caption" color="text.secondary" display="block">
                Last 10: {last10.join('–')}
              </Typography>
            )}
            {streak && (
              <Typography variant="caption" fontWeight={600} sx={{ display: 'block', mt: 0.25 }}>
                {streak}
              </Typography>
            )}
          </Box>
        )}
      </Grid>
    </LabelPaper>
  )
}
