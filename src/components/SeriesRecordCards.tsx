import { Box, Paper, Typography } from '@mui/material'
import { formatSeriesPct, type SeriesStats } from '../lib/series'

type SeriesRecordCardsProps = {
  stats: SeriesStats
}

export function SeriesRecordCards({ stats }: SeriesRecordCardsProps) {
  const { wins, losses, ties, pct, last10, streak } = stats
  const last10Record = last10.reduce(
    (acc, ch) => {
      if (ch === 'W') acc.w += 1
      else if (ch === 'L') acc.l += 1
      else acc.t += 1
      return acc
    },
    { w: 0, l: 0, t: 0 },
  )

  const last10Summary =
    last10.length === 0
      ? null
      : `${last10Record.w}–${last10Record.l}${
          last10Record.t > 0 ? `–${last10Record.t}` : ''
        }`

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
        Series Record
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          textAlign: 'center',
          gap: 1,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
            {wins}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Wins
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
            {losses}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Losses
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            {ties}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Ties
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', mt: 1.5 }}
      >
        <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {formatSeriesPct(pct)}
        </Box>{' '}
        series win pct
      </Typography>

      {(streak || last10Summary) && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 1.25 }}
        >
          {[
            streak ? `Streak ${streak}` : null,
            last10Summary ? `Last 10 ${last10Summary}` : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        </Typography>
      )}
    </Paper>
  )
}
