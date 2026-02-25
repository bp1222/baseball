import { Chip } from '@mui/material'

import { useCustomPalette } from '@/theme/useCustomPalette'
import { SeriesResult } from '@/types/Series/SeriesResult'
import { SeriesType } from '@/types/Series/SeriesType'

type ResultBadgeProps = {
  result: SeriesResult
  type: SeriesType
}

const RESULT_LABELS: Record<SeriesResult, string> = {
  [SeriesResult.Win]: 'Win',
  [SeriesResult.Loss]: 'Loss',
  [SeriesResult.Sweep]: 'Sweep',
  [SeriesResult.Swept]: 'Swept',
  [SeriesResult.Tie]: 'Tie',
  [SeriesResult.InProgress]: 'In progress',
  [SeriesResult.Unplayed]: '',
  [SeriesResult.WorldSeriesWin]: 'Win',
}

export const ResultBadge = ({ result, type }: ResultBadgeProps) => {
  const { seriesBadge } = useCustomPalette()
  const label = RESULT_LABELS[result]
  if (!label) return null

  const effectiveResult =
    type === SeriesType.World && result === SeriesResult.Win ? SeriesResult.WorldSeriesWin : result
  const badgeColors = seriesBadge[effectiveResult]

  return (
    <Chip
      label={label}
      size="small"
      variant="filled"
      sx={{
        height: 22,
        fontSize: '0.7rem',
        fontWeight: 600,
        borderRadius: 0.5,
        bgcolor: badgeColors.light,
        color: badgeColors.contrastText,
        border: '1px solid',
        borderColor: badgeColors.main,
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  )
}
