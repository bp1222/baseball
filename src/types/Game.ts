import {Game as MLBGame} from "@bp1222/stats-api"
import dayjs from "dayjs"

import {GameStatus, GameStatusFromMLBGameStatus} from "@/types/Game/GameStatus.ts"
import {GameType, GameTypeFromMLBGameType} from "@/types/Game/GameType.ts"
import {GameTeam, GameTeamFromMLBGameTeam} from "@/types/GameTeam.ts"

export type Game = {
  pk: number
  gameDate: dayjs.Dayjs
  gameType: GameType
  gameStatus: GameStatus
  home: GameTeam
  away: GameTeam
}

export const GameFromMLBGame = (game: MLBGame): Game => ({
  pk: game.gamePk,
  gameDate: dayjs(game.gameDate),
  gameType: GameTypeFromMLBGameType(game.gameType),
  gameStatus: GameStatusFromMLBGameStatus(game.status.codedGameState!),
  home: GameTeamFromMLBGameTeam(game.teams.home, true),
  away: GameTeamFromMLBGameTeam(game.teams.away),
})