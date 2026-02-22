/**
 * Scorecard hero — prominent score and matchup at top of boxscore
 */

import {Box, Typography, useTheme} from '@mui/material'
import dayjs from 'dayjs'

import {GetTeamImage} from '@/components/Shared/GetTeamImage'
import {useLinescore} from '@/queries/linescore'
import {useTeams} from '@/queries/team'
import {Game} from '@/types/Game'
import {GameStatus} from '@/types/Game/GameStatus'
import {GameTeam} from '@/types/GameTeam'

type ScorecardHeroProps = {
  game: Game
}

export const ScorecardHero = ({ game }: ScorecardHeroProps) => {
  const theme = useTheme()
  const { data: teams } = useTeams()
  const isDark = theme.palette.mode === 'dark'

  const isLive = game.gameStatus === GameStatus.InProgress
  const { data: linescore } = useLinescore(game.pk, isLive)

  const awayScore = isLive && linescore != null ? linescore.away.runs : (game.away.score ?? 0)
  const homeScore = isLive && linescore != null ? linescore.home.runs : (game.home.score ?? 0)

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

  const getTeamGameComponent = (gameTeam: GameTeam, score: number) => {
    const team = teams?.find((t) => t.id === gameTeam.teamId)
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
        {getTeamGameComponent(game.away, awayScore)}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 0.5, sm: 1.5 },
            flexShrink: 0,
            gap: 0.5,
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            @
          </Typography>
          {statusLabel && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: { xs: 0.5, sm: 1 },
                py: 0.25,
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
                fontWeight={700}
                sx={{
                  fontSize: { xs: '0.65rem', sm: 'inherit' },
                  lineHeight: 2,
                  textAlign: 'center',
                }}
              >
                {statusLabel}
              </Typography>
            </Box>
          )}
          {isLive && linescore != null && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: { xs: 0.5, sm: 0.75 },
                py: 0.5,
                mt: 0.5,
                borderRadius: 1,
                bgcolor: isDark ? 'grey.800' : 'grey.200',
                border: 1,
                borderColor: 'divider',
              }}
            >
              {(linescore.currentInning != null && linescore.isTopInning != null) && (
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, lineHeight: 1.4 }}
                >
                  {linescore.isTopInning ? 'Top' : 'Bottom'} {linescore.currentInningOrdinal ?? linescore.currentInning}
                </Typography>
              )}
              <Typography
                variant="caption"
                color="text.primary"
                sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, lineHeight: 1.4 }}
              >
                B: {linescore.balls ?? 0} · S: {linescore.strikes ?? 0} · O: {linescore.outs ?? 0}
              </Typography>
            </Box>
          )}
        </Box>

        {getTeamGameComponent(game.home, homeScore)}
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
