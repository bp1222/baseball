import { Boxscore as MLBBoxscore, BoxscoreTeam as MLBBoxscoreTeam } from '@bp1222/stats-api'

import { Player, PlayerFromMLBPlayer } from '@/types/Player.ts'

export type BoxscoreTeam = {
  teamId: number
  batters: number[]
  pitchers: number[]
  bench: number[]
  bullpen: number[]
  players: Record<number, Player>
}

export type Boxscore = {
  away: BoxscoreTeam
  home: BoxscoreTeam
}

function getPlayersFromMLBTeamBoxscorePlayers(players: MLBBoxscoreTeam['players']): Record<number, Player> {
  const ret: Record<number, Player> = {}
  Object.keys(players).forEach((key) => {
    const player = players[key]
    ret[Number(key.substring(2))] = PlayerFromMLBPlayer(player)
  })
  return ret
}

export const BoxscoreFromMLBBoxscore = (boxscore: MLBBoxscore): Boxscore => ({
  away: {
    teamId: boxscore.teams.away.team.id,
    batters: boxscore.teams.away.batters,
    pitchers: boxscore.teams.away.pitchers,
    bench: boxscore.teams.away.bench,
    bullpen: boxscore.teams.away.bullpen,
    players: getPlayersFromMLBTeamBoxscorePlayers(boxscore.teams.away.players),
  },
  home: {
    teamId: boxscore.teams.home.team.id,
    batters: boxscore.teams.home.batters,
    pitchers: boxscore.teams.home.pitchers,
    bench: boxscore.teams.home.bench,
    bullpen: boxscore.teams.home.bullpen,
    players: getPlayersFromMLBTeamBoxscorePlayers(boxscore.teams.home.players),
  },
})
