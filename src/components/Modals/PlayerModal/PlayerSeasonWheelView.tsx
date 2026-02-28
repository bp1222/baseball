import type { PersonStatsItem } from '@bp1222/stats-api'
import { Box, CircularProgress, Typography } from '@mui/material'

import { PlayerSeasonWheel } from '@/components/Player/PlayerSeasonWheel'
import { usePersonGameLog } from '@/queries/person'
import { useTeam } from '@/queries/team.ts'
import type { GameLogSplit } from '@/types/GameLogSplit'

type PlayerSeasonWheelViewProps = {
  personId: string
  playerName: string
  currentTeamId: number | undefined
  selectedSeason: string
  hittingStats: PersonStatsItem | undefined
}

export const PlayerSeasonWheelView = ({
  personId,
  playerName,
  currentTeamId,
  selectedSeason,
  hittingStats,
}: PlayerSeasonWheelViewProps) => {
  const hittingGameLog = usePersonGameLog(personId, selectedSeason, 'hitting')
  const { data: team } = useTeam(currentTeamId)

  if (hittingGameLog.isPending) {
    return (
      <Box display="flex" justifyContent="center" py={2}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (hittingGameLog.data == null || hittingGameLog.data.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No hitting data for season wheel in {selectedSeason}.
      </Typography>
    )
  }

  return (
    <PlayerSeasonWheel
      playerName={playerName}
      team={team}
      season={selectedSeason}
      gameLog={hittingGameLog.data as GameLogSplit[]}
      seasonSplit={hittingStats?.splits?.find((s) => s.season === selectedSeason)}
    />
  )
}
