/**
 * Scorecard hero — prominent score and matchup at top of boxscore
 */

import { Box, Typography, useTheme } from '@mui/material'
import dayjs from 'dayjs'

import { GetTeamImage } from '@/components/Shared/GetTeamImage'
import { useTeams } from '@/queries/team'
import { Game } from '@/types/Game'
import { GameStatus } from '@/types/Game/GameStatus'
import { GameTeam } from '@/types/GameTeam'

type ScorecardHeroProps = {
  game: Game
}

export const ScorecardHero = ({ game }: ScorecardHeroProps) => {
  const theme = useTheme()
  const { data: teams } = useTeams()
  const isDark = theme.palette.mode === 'dark'

  const statusLabel =
    game.gameStatus === GameStatus.Final
      ? 'FINAL'
      : game.gameStatus === GameStatus.InProgress
        ? 'LIVE'
        : game.gameStatus === GameStatus.Scheduled
          ? dayjs(game.gameDate).format('h:mm A')
          : game.gameStatus === GameStatus.Postponed
            ? 'POSTPONED'
            : game.gameStatus === GameStatus.Canceled
              ? 'CANCELED'
              : ''

  const getTeamGameComponent = (gameTeam: GameTeam) => {
    const team = teams?.find((t) => t.id === gameTeam.teamId)
    const score = gameTeam.score ?? 0
    const record =
      gameTeam.record.wins != null && gameTeam.record.losses != null
        ? `${gameTeam.record.wins}-${gameTeam.record.losses}`
        : null

    return (
      <Box
        sx={{
          flex: '1 1 0',
          minWidth: { xs: 0, sm: 120 },
          maxWidth: { xs: 'none', sm: 280 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 1.5, sm: 2 },
          px: { xs: 0.75, sm: 1.5 },
        }}
      >
        <Box
          sx={{
            width: { xs: 36, sm: 48 },
            height: { xs: 36, sm: 48 },
            mb: 0.5,
            '& img': { width: '100%', height: '100%', objectFit: 'contain' },
          }}
        >
          {GetTeamImage(team)}
        </Box>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          noWrap
          sx={{ fontSize: { xs: '0.75rem', sm: 'inherit' } }}
        >
          {team?.abbreviation ?? 'AWAY'}
        </Typography>
        <Typography variant="h4" fontWeight={700} component="p" sx={{ fontSize: { xs: '1.5rem', sm: 'inherit' } }}>
          {score}
        </Typography>
        {record && (
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {record}
          </Typography>
        )}
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'action.hover',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: 0,
          flexWrap: 'nowrap',
          minWidth: 0,
        }}
      >
        {getTeamGameComponent(game.away)}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 0.5, sm: 1.5 },
            flexShrink: 0,
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            @
          </Typography>
          {statusLabel && (
            <Box
              sx={{
                px: { xs: 0.5, sm: 1 },
                borderRadius: 1,
                bgcolor:
                  game.gameStatus === GameStatus.InProgress
                    ? 'success.main'
                    : game.gameStatus === GameStatus.Final
                      ? isDark
                        ? 'grey.600'
                        : 'grey.400'
                      : isDark
                        ? 'grey.700'
                        : 'grey.300',
                color:
                  game.gameStatus === GameStatus.InProgress ? 'success.contrastText' : isDark ? 'grey.100' : 'grey.800',
              }}
            >
              <Typography
                variant="caption"
                alignContent={'center'}
                fontWeight={700}
                sx={{ fontSize: { xs: '0.65rem', sm: 'inherit' } }}
              >
                {statusLabel}
              </Typography>
            </Box>
          )}
        </Box>

        {getTeamGameComponent(game.home)}
      </Box>
      {game.venue?.name && (
        <Box
          sx={{
            py: 0.75,
            px: 1.5,
            borderTop: 1,
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {game.venue.name}
          </Typography>
        </Box>
      )}
    </Box>
  )
}
