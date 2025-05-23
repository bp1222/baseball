import {Game, GameStatusCode, GameTeam, GameType} from "@bp1222/stats-api"
import dayjs from "dayjs"

import {GameFromMLBGame} from "@/types/Game.ts"
import {Series} from "@/types/Series.ts"
import {SeriesType} from "@/types/Series/SeriesType.ts"

const seriesPk = (teamA: GameTeam, teamB: GameTeam, seriesType: SeriesType) => {
  return teamA.team.id + "-" + teamA.seriesNumber + "-" + teamB.team.id + "-" + teamB.seriesNumber + "-" + seriesType
}

const gameToSeriesType = (game: Game): SeriesType => {
  switch (game.gameType) {
    case GameType.Regular:
      return SeriesType.Regular
    case GameType.SpringTraining:
      return SeriesType.SpringTraining
    case GameType.WildCardSeries:
      return SeriesType.WildCard
    case GameType.DivisionSeries:
      return SeriesType.Division
    case GameType.LeagueChampionshipSeries:
      return SeriesType.League
    case GameType.WorldSeries:
      return SeriesType.World
    default:
      return SeriesType.Unknown
  }
}

export const SeriesFromMLBSchedule = (schedule: Game[]) => {
  const seasonSeries: Series[] = []
  const seenGames: number[] = []

  const getCurrentSeries = (game: Game) => {
    if (game.teams == undefined) {
      throw new Error("Game has no teams")
    }

    // Get the existing series, or create a new one
    // Existing may be a home and away series, so will need to check if the pk is based
    // on either the most recent series being an alternate home/away.
    // Also need to ensure they're the same type of series; regular season, playoffs, etc.
    let currentSeries = seasonSeries.find((s) =>
      s.pk == seriesPk(game.teams.home, game.teams.away, gameToSeriesType(game)) ||
      s.pk == seriesPk(game.teams.away, game.teams.home, gameToSeriesType(game)))

    if (currentSeries == undefined) {
      const newPk = seriesPk(game.teams.home, game.teams.away, gameToSeriesType(game))
      currentSeries = {
        pk: newPk,
        type: SeriesType.Unknown,
        games: [],
      }
      seasonSeries.push(currentSeries)
    }

    return currentSeries
  }

  seasonSeries.length = 0
  schedule.forEach((game: Game) => {
    if (game.gameType == GameType.SpringTraining || game.gameType == GameType.Exhibition) {
      return
    }

    // Do not track postponed games, they apply to a future series
    if (game.status?.codedGameState == GameStatusCode.Postponed) {
      return
    }

    // The gamePk will be the same for makeup games which were postponed, and suspended games.
    // Those games that get suspended on one day, and resume prior to the following days game,
    // will record the actual "Final" state in recorded games on _each_ day where the game was
    // played.  There is not a "Suspended" status like what Postponed games have, so we need to
    // track seen games here.  If we've already recorded a game, do not parse a duplicate
    if (game.gamePk) {
      if (seenGames.indexOf(game.gamePk) > 0) {
        return
      }
      seenGames.push(game.gamePk)
    }

    // This is after the above check.  If a game is suspended and completed at a later date
    // The first game will be recorded as a "Final" state, and the second game will also be recorded
    // But it will have a different series number associated.  Thus, we don't want to pull the series
    // of a previously seen game
    const currentSeries = getCurrentSeries(game)

    // If this series has no games, set some defaults.  Why not just look if it's the first game in a series?
    // Because the 2021 Reds start the season on game 4 of a 6 game series.  Clearly a data problem with
    // MLB data, because it should be game 1 of 3.  WTF?!
    if (currentSeries.games.length == 0) {
      currentSeries.type = gameToSeriesType(game)
      currentSeries.startDate = dayjs(game.gameDate)
    }

    // Always update, we don't know if the last game of a scheduled series may end up postponed.
    currentSeries.endDate = dayjs(game.gameDate)

    // Store this game into the series.
    currentSeries.games.push(GameFromMLBGame(game))
  })

  // Due to data being weird or inconsistent in 2020, specifically, we will go ahead and
  // merge all series that are sequential but not the same series number.
  return seasonSeries.reduce((filtered: Series[], cur) => {
    const prev = filtered.at(-1)
    if (prev && prev.type == cur.type &&
      prev.games[0].home.teamId == cur.games[0].home.teamId &&
      prev.games[0].away.teamId == cur.games[0].away.teamId) {

      prev.games = [...prev.games, ...cur.games]
      prev.games.sort((a, b) => a.gameDate.diff(b.gameDate, "minute"))
    } else {
      filtered.push(cur)
    }
    return filtered
  }, [])
}
