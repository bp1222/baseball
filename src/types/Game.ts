import {Game as MLBGame} from "@bp1222/stats-api"
import dayjs from "dayjs"

import {Boxscore} from "@/types/Boxscore.ts"
import {GameStatus, GameStatusFromMLBGameStatus} from "@/types/Game/GameStatus.ts"
import {GameType, GameTypeFromMLBGameType} from "@/types/Game/GameType.ts"
import {GameTeam, GameTeamFromMLBGameTeam} from "@/types/GameTeam.ts"
import {Linescore} from "@/types/Linescore.ts"

export type Game = {
  pk: number
  gameDate: dayjs.Dayjs
  gameType: GameType
  gameStatus: GameStatus
  home: GameTeam
  away: GameTeam
  linescore?: Linescore
  boxscore?: Boxscore
}

export const GameFromMLBGame = (game: MLBGame): Game => ({
  pk: game.gamePk,
  gameDate: dayjs(game.gameDate),
  gameType: GameTypeFromMLBGameType(game.gameType),
  gameStatus: GameStatusFromMLBGameStatus(game.status.codedGameState!),
  home: GameTeamFromMLBGameTeam(game.teams.home, true),
  away: GameTeamFromMLBGameTeam(game.teams.away),
})

export const UpdateGameFromLinescore = (game: Game, linescore: Linescore) => {
  game.linescore = {
    ...game.linescore,
    ...linescore
  }
  return game
}

export const UpdateGameFromBoxscore = (game: Game, boxscore: Boxscore) => {
  game.boxscore = {
    ...game.boxscore,
    ...boxscore
  }
  return game
}
