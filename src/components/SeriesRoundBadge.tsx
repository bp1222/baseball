import { Chip } from '@mui/material'
import { postseasonRoundLabel, type Series } from '../lib/series'

type SeriesRoundBadgeProps = {
  series: Series
  perspectiveTeamId?: number
}

/** Same Chip treatment as series outcome badges. */
export function SeriesRoundBadge({ series, perspectiveTeamId }: SeriesRoundBadgeProps) {
  const label = postseasonRoundLabel(series, perspectiveTeamId)
  if (!label) return null

  return (
    <Chip
      size="small"
      label={label}
      sx={{
        mt: 0.25,
        height: 22,
        fontWeight: 700,
        bgcolor: 'primary.main',
        color: '#fff',
        '& .MuiChip-label': {
          px: 0.75,
          fontSize: '0.65rem',
        },
      }}
    />
  )
}
