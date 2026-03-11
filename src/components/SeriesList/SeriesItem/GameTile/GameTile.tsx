/**
 * GameTile - The small clickable tile representing a game
 *
 * Displays:
 * - Date badge (or TODAY/PPD/CANC)
 * - Game number in series
 * - Team scores
 * - Game status line
 *
 * Opens the boxscore modal via ModalContext when clicked.
 */

import { Box, Grid } from '@mui/material'
import dayjs from 'dayjs'
import { MouseEvent } from 'react'

import { useInterestedTeam } from '@/context/InterestedTeamContext'
import { useModal } from '@/context/ModalContext'
import { useTeam } from '@/queries/team'
import { useCustomPalette } from '@/theme/useCustomPalette'
import { Game } from '@/types/Game'
import { GetGameResult } from '@/types/Game/GameResult'
import { GameStatus } from '@/types/Game/GameStatus'

import { GameScore } from './GameScore'
import { GameStatusLine } from './GameStatusLine'

type GameTileProps = {
  game: Game
  selectedDate?: dayjs.Dayjs
  /** 1-based game number in the series (e.g. 2 for "Game 2 of 3") */
  gameNumber?: number
  /** Total games in the series */
  gamesInSeries?: number
}

export const GameTile = ({ game, selectedDate, gameNumber, gamesInSeries }: GameTileProps) => {
  const { openBoxscore } = useModal()
  const { gameResult, gameStatus } = useCustomPalette()

  const interestedTeam = useInterestedTeam()
  const { data: awayTeam } = useTeam(game.away.teamId)
  const { data: homeTeam } = useTeam(game.home.teamId)

  const isPostponedOrCanceled = game.gameStatus === GameStatus.Postponed || game.gameStatus === GameStatus.Canceled
  const postponedCanceledBadge =
    game.gameStatus === GameStatus.Postponed ? 'PPD' : game.gameStatus === GameStatus.Canceled ? 'CANC' : null

  const tileColors = interestedTeam ? gameResult[GetGameResult(game, interestedTeam)] : gameStatus[game.gameStatus]

  const awayAbbr = awayTeam?.abbreviation ?? 'Away'
  const homeAbbr = homeTeam?.abbreviation ?? 'Home'

  const awayColors = interestedTeam ? tileColors : gameResult[GetGameResult(game, awayTeam)]
  const homeColors = interestedTeam ? tileColors : gameResult[GetGameResult(game, homeTeam)]

  const gameIsToday = dayjs(game.gameDate).isSame(interestedTeam ? dayjs() : selectedDate, 'day')
  const tileBg = gameIsToday ? 'primary.50' : tileColors.light
  const tileBorder = gameIsToday ? 'primary.main' : tileColors.main
  const badgeBg = gameIsToday ? 'primary.main' : tileColors.dark
  const badgeTextColor = gameIsToday ? 'primary.contrastText' : tileColors.contrastText

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    openBoxscore(game)
  }

  return (
    <Grid
      container
      tabIndex={0}
      role="button"
      onClick={handleClick}
      id={game.pk + '-game'}
      flexDirection="column"
      sx={{
        cursor: 'pointer',
        ...(gameIsToday && { boxShadow: 2 }),
        ...(isPostponedOrCanceled && { opacity: 0.88 }),
        width: 60,
        minWidth: 60,
        minHeight: 44,
        marginTop: 0.75,
        marginBottom: 0.75,
        marginRight: 1,
      }}
      border={gameIsToday ? 2 : 0.75}
      borderColor={gameIsToday ? 'primary.main' : tileBorder}
      borderRadius={0.5}
      bgcolor={tileBg}
      aria-label={`View boxscore: ${awayAbbr} at ${homeAbbr}${postponedCanceledBadge ? ` (${postponedCanceledBadge})` : ''}`}
    >
      {/* Date badge */}
      <Box
        flexGrow={1}
        sx={{ fontSize: '0.75rem', color: badgeTextColor }}
        textAlign="center"
        paddingLeft={0.2}
        paddingRight={0.2}
        bgcolor={badgeBg}
        fontWeight={gameIsToday ? 700 : 400}
      >
        {postponedCanceledBadge ? postponedCanceledBadge : dayjs(game.gameDate).format('MMM DD').toUpperCase()}
      </Box>
      {/* Game number in series */}
      {gameNumber != null && gamesInSeries != null && gamesInSeries > 0 && (
        <Box
          borderBottom={1}
          sx={{
            fontSize: '0.65rem',
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          Game {gameNumber}
        </Box>
      )}
      {/* Scores */}
      <Grid>
        <GameScore game={game} gameTeam={game.away} colors={awayColors} />
      </Grid>
      <Grid>
        <GameScore game={game} gameTeam={game.home} colors={homeColors} />
      </Grid>
      {/* Status line */}
      <Grid>
        <GameStatusLine game={game} />
      </Grid>
    </Grid>
  )
}
