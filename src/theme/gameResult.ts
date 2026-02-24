import type { PaletteColor, PaletteMode } from '@mui/material'
import { blue, grey, lightGreen, red } from '@mui/material/colors'

import { Game } from '@/types/Game'
import { GameResult } from '@/types/Game/GameResult'
import { GameStatus } from '@/types/Game/GameStatus'
import { Team } from '@/types/Team'

type GameResultKey = Exclude<GameResult, GameResult.Home | GameResult.Away>

const LightColors: Record<GameResultKey, PaletteColor> = {
  [GameResult.Win]: { light: lightGreen[50], main: lightGreen[400], dark: lightGreen[300], contrastText: lightGreen[800] },
  [GameResult.Loss]: { light: red[50], main: red[400], dark: red[300], contrastText: red[800] },
  [GameResult.Tie]: { light: blue[50], main: blue[400], dark: blue[300], contrastText: blue[800] },
  [GameResult.Unknown]: { light: grey[50], main: grey[400], dark: grey[300], contrastText: grey[800] },
}

const DarkColors: Record<GameResultKey, PaletteColor> = {
  [GameResult.Win]: { light: '#1a2e1a', main: '#2d4a2d', dark: '#2d4a2d', contrastText: '#b8d4b8' },
  [GameResult.Loss]: { light: '#2e1a1a', main: '#4a2d2d', dark: '#4a2d2d', contrastText: '#d4b8b8' },
  [GameResult.Tie]: { light: '#1a1a2e', main: '#2d2d4a', dark: '#2d2d4a', contrastText: '#b8b8d4' },
  [GameResult.Unknown]: { light: grey[800], main: grey[700], dark: grey[700], contrastText: grey[100] },
}

function resolveResult(game: Game, team: Team | undefined): GameResultKey {
  if (game.gameStatus !== GameStatus.Final || team == null) return GameResult.Unknown
  const homeWins = (game.home.score ?? 0) > (game.away.score ?? 0)
  const awayWins = (game.away.score ?? 0) > (game.home.score ?? 0)
  if ((game.home.score ?? 0) === (game.away.score ?? 0)) return GameResult.Tie
  if (homeWins && game.home.teamId === team.id) return GameResult.Win
  if (awayWins && game.away.teamId === team.id) return GameResult.Win
  return GameResult.Loss
}

export const GetGameResultColor = (game: Game, team: Team | undefined, mode: PaletteMode = 'light'): PaletteColor => {
  const result = resolveResult(game, team)
  return mode === 'dark' ? DarkColors[result] : LightColors[result]
}

export const GetGameStatusTileColor = (status: GameStatus, mode: PaletteMode = 'light'): PaletteColor => {
  const dark = mode === 'dark'
  switch (status) {
    case GameStatus.InProgress:
      return dark
        ? { light: grey[700], main: grey[600], dark: grey[700], contrastText: grey[100] }
        : { light: blue[50], main: blue[400], dark: blue[300], contrastText: blue[800] }
    case GameStatus.Canceled:
      return dark
        ? { light: '#2e251a', main: '#4a3d2d', dark: '#4a3d2d', contrastText: '#e0d4b8' }
        : { light: grey[50], main: grey[400], dark: grey[300], contrastText: grey[800] }
    default:
      return dark ? DarkColors[GameResult.Unknown] : LightColors[GameResult.Unknown]
  }
}
