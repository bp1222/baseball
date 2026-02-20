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

import { Box, Color, Grid } from '@mui/material'
import dayjs from 'dayjs'
import { useRef } from 'react'

import { useInterestedTeam } from '@/context/InterestedTeamContext'
import { useModal } from '@/context/ModalContext'
import { useThemeMode } from '@/context/ThemeModeContext'
import { useTeams } from '@/queries/team'
import { Game } from '@/types/Game'
import {
  DefaultGameResultColor,
  GameTileDarkColorsMap,
  GetGameResultColor,
  getGameTileDarkKey,
} from '@/types/Game/GameResult'
import { GameStatus, GetGameStatusColor } from '@/types/Game/GameStatus'

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
  const interestedTeam = useInterestedTeam()
  const { mode } = useThemeMode()
  const { data: teams } = useTeams()
  const { openBoxscore } = useModal()
  const tileRef = useRef<HTMLDivElement>(null)
  const isDark = mode === 'dark'

  const gameIsToday = dayjs(game.gameDate).isSame(interestedTeam ? dayjs() : selectedDate, 'day')

  const awayAbbr = teams?.find((t) => t.id === game.away.teamId)?.abbreviation ?? 'Away'
  const homeAbbr = teams?.find((t) => t.id === game.home.teamId)?.abbreviation ?? 'Home'

  const isPostponedOrCanceled = game.gameStatus === GameStatus.Postponed || game.gameStatus === GameStatus.Canceled
  const postponedCanceledBadge =
    game.gameStatus === GameStatus.Postponed ? 'PPD' : game.gameStatus === GameStatus.Canceled ? 'CANC' : null

  const gameTileColor: Color = interestedTeam
    ? GetGameResultColor(game, interestedTeam)
    : [GameStatus.InProgress, GameStatus.Canceled].indexOf(game.gameStatus) > -1
      ? GetGameStatusColor(game.gameStatus)
      : DefaultGameResultColor

  const darkColors = isDark ? GameTileDarkColorsMap[getGameTileDarkKey(game, interestedTeam ?? undefined)] : null

  const tileBg = gameIsToday ? 'primary.50' : darkColors ? darkColors.bg : gameTileColor[50]
  const tileBorder = gameIsToday ? 'primary.main' : darkColors ? darkColors.border : gameTileColor[400]
  const badgeBg = gameIsToday ? 'primary.main' : darkColors ? darkColors.badgeBg : gameTileColor[300]
  const badgeTextColor = gameIsToday ? 'primary.contrastText' : darkColors ? darkColors.text : gameTileColor[800]

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    openBoxscore(game, tileRef.current)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openBoxscore(game, tileRef.current)
    }
  }

  return (
    <Grid
      ref={tileRef}
      container
      tabIndex={0}
      role="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
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
      borderRadius={0.5}
      borderColor={tileBorder}
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
        <GameScore
          gameTeam={game.away}
          color={GetGameResultColor(game, interestedTeam ?? teams?.find((t) => t.id == game.away.teamId))}
          darkMode={isDark}
          darkModeColors={
            darkColors ? { bg: darkColors.bg, border: darkColors.border, text: darkColors.text } : undefined
          }
        />
      </Grid>
      <Grid>
        <GameScore
          gameTeam={game.home}
          color={GetGameResultColor(game, interestedTeam ?? teams?.find((t) => t.id == game.home.teamId))}
          darkMode={isDark}
          darkModeColors={
            darkColors ? { bg: darkColors.bg, border: darkColors.border, text: darkColors.text } : undefined
          }
        />
      </Grid>

      {/* Status line */}
      <Grid>
        <GameStatusLine game={game} />
      </Grid>
    </Grid>
  )
}
