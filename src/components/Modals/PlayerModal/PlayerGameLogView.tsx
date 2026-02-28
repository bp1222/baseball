import type { PersonStatsItem } from '@bp1222/stats-api'
import { Box, CircularProgress, Typography } from '@mui/material'

import { usePersonGameLog } from '@/queries/person'
import type { GameLogSplit } from '@/types/GameLogSplit'

import { GameLogTable } from './GameLogTable'

type PlayerGameLogViewProps = {
  personId: number
  selectedSeason: string
  hittingStats: PersonStatsItem | undefined
  pitchingStats: PersonStatsItem | undefined
}

export const PlayerGameLogView = ({
  personId,
  selectedSeason,
  hittingStats,
  pitchingStats,
}: PlayerGameLogViewProps) => {
  const hittingGameLog = usePersonGameLog(personId, selectedSeason, 'hitting')
  const pitchingGameLog = usePersonGameLog(personId, selectedSeason, 'pitching')

  if ((hittingStats && hittingGameLog.isPending) || (pitchingStats && pitchingGameLog.isPending)) {
    return (
      <Box display="flex" justifyContent="center" py={2}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  const hasHittingData = hittingStats && hittingGameLog.data != null && hittingGameLog.data.length > 0
  const hasPitchingData = pitchingStats && pitchingGameLog.data != null && pitchingGameLog.data.length > 0

  const noData =
    (hittingStats && hittingGameLog.data?.length === 0 && !pitchingStats) ||
    (pitchingStats && pitchingGameLog.data?.length === 0 && !hittingStats) ||
    (hittingStats && pitchingStats && hittingGameLog.data?.length === 0 && pitchingGameLog.data?.length === 0)

  return (
    <Box>
      {hasHittingData && (
        <GameLogTable
          title={`Hitting game log · ${selectedSeason}`}
          splits={hittingGameLog.data as GameLogSplit[]}
          group="hitting"
        />
      )}
      {hasPitchingData && (
        <GameLogTable
          title={`Pitching game log · ${selectedSeason}`}
          splits={pitchingGameLog.data as GameLogSplit[]}
          group="pitching"
        />
      )}
      {noData && (
        <Typography variant="body2" color="text.secondary">
          No game log for {selectedSeason}.
        </Typography>
      )}
    </Box>
  )
}
