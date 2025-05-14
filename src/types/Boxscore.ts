import {Boxscore as MLBBoxscore} from "@bp1222/stats-api"

import {Player, PlayerFromMLBPlayer} from "@/types/Player.ts"

export type BoxscoreTeam = {
  teamId: number
  players: Player[]
}

export type Boxscore = {
  away: BoxscoreTeam
  home: BoxscoreTeam
}

export function BoxscoreFromMLBBoxscore(boxscore: MLBBoxscore): Boxscore {
  return {
    away: {
      teamId: boxscore.teams.away.team.id,
      players: Object.values(boxscore.teams.away.players).map((player) => PlayerFromMLBPlayer(player))
    },
    home: {
      teamId: boxscore.teams.home.team.id,
      players: Object.values(boxscore.teams.home.players).map((player) => PlayerFromMLBPlayer(player))
    }
  }
}
