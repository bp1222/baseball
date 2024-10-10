import {
  Game, GameStatusCode, GameTeam,
  GameType, Team,
} from "@bp1222/stats-api"

export enum SeriesWinner {
  Unknown,
  Home,
  Away,
}

export enum SeriesResult {
  Win,
  Loss,
  Tie,
  Sweep,
  Swept,
  Unplayed,
  InProgress,
}

export enum SeriesHomeAway {
  Unknown,
  Home,
  Away,
  Split,
}

export enum SeriesType {
  Unknown,
  SpringTraining,
  RegularSeason,
  WildCard,
  Division,
  League,
  World,
}

export enum GameResult {
  Win,
  Loss,
  Tie,
  Unplayed,
  InProgress,
  GameOver,
  Canceled,
  Postponed
}

export type Series = {
  pk: string
  type: SeriesType
  startDate: string
  endDate: string
  games: Game[]
  winner: SeriesWinner
}

export const GetSeriesHomeAway = (series: Series, team?: Team): SeriesHomeAway => {
  if (team == undefined) {
    return SeriesHomeAway.Unknown
  }

  if (series.games.length == 0) {
    return SeriesHomeAway.Unknown
  }

  if (series.games[0].teams == undefined) {
    throw new Error("Game has no teams")
  }

  let isAway = false
  let isHome = false
  series.games.forEach((game) => {
    if (game.teams.home.team.id == team.id) {
      isHome = true
    }
    if (game.teams.away.team.id == team.id) {
      isAway = true
    }
  })

  if (isHome && isAway) {
    return SeriesHomeAway.Split
  }

  if (isHome) {
    return SeriesHomeAway.Home
  }

  if (isAway) {
    return SeriesHomeAway.Away
  }

  return SeriesHomeAway.Unknown
}

export const GetSeriesGameResult = (game: Game, team?: Team): GameResult => {
  if (game.teams == undefined) {
    throw new Error("Game has no teams")
  }

  switch (game.status.codedGameState) {
    case GameStatusCode.Canceled:
      return GameResult.Canceled
    case GameStatusCode.Postponed:
      return GameResult.Postponed
    case GameStatusCode.GameOver:
      return GameResult.GameOver
    case GameStatusCode.InProgress:
    case GameStatusCode.Pregame:
      return GameResult.InProgress
  }

  if (team == undefined) {
    return GameResult.Unplayed
  }

  if (game.teams.home.team.id == team.id) {
    if (game.teams.home.isWinner) {
      return GameResult.Win
    } else if (game.teams.away.isWinner) {
      return GameResult.Loss
    }
  } else if (game.teams.away.team.id == team.id) {
    if (game.teams.away.isWinner) {
      return GameResult.Win
    } else if (game.teams.home.isWinner) {
      return GameResult.Loss
    }
  }

  return GameResult.Unplayed
}

export const GetSeriesWins = (series: Series, team?: Team): number => {
  if (team == undefined) return 0

  return series.games.filter((game) =>
    [GameStatusCode.Final, GameStatusCode.GameOver].indexOf(game.status.codedGameState!) > -1 &&
    ((game.teams?.home.team.id == team.id && game.teams.home.isWinner) ||
      (game.teams?.away.team.id == team.id && game.teams.away.isWinner))).length
}

export const GetSeriesLosses = (series: Series, team?: Team): number => {
  if (team == undefined) return 0

  return series.games.filter((game) =>
    [GameStatusCode.Final, GameStatusCode.GameOver].indexOf(game.status.codedGameState!) > -1 &&
    ((game.teams?.home.team.id == team.id && !game.teams.home.isWinner) ||
      (game.teams?.away.team.id == team.id && !game.teams.away.isWinner))).length
}

export const GetSeriesResult = (series: Series, team?: Team): SeriesResult => {
  if (team == undefined) {
    return SeriesResult.Unplayed
  }

  // games where home wins
  const wins = GetSeriesWins(series, team)
  const losses = GetSeriesLosses(series, team)

  if (losses != 0 || wins != 0) {
    const playedGames = losses + wins
    const gamesInSeries = series.games.length
    if (playedGames < gamesInSeries) {
      const det = Math.ceil((gamesInSeries + 1) / 2)
      return playedGames >= det
        ? wins >= det
          ? SeriesResult.Win
          : losses >= det
            ? SeriesResult.Loss
            : SeriesResult.InProgress
        : SeriesResult.InProgress
    } else {
      return losses == 0
        ? SeriesResult.Sweep
        : wins == 0
          ? SeriesResult.Swept
          : wins > losses
            ? SeriesResult.Win
            : wins == losses
              ? SeriesResult.Tie
              : SeriesResult.Loss
    }
  }

  return SeriesResult.Unplayed
}

const GenerateSeasonSeries = (schedule: Game[]): Series[] => {
  const seenGames: number[] = []
  const seasonSeries: Series[] = []

  const newSeries = () => {
    return {
      pk: "",
      type: SeriesType.Unknown,
      startDate: "",
      endDate: "",
      games: [],
      winner: SeriesWinner.Unknown,
    }
  }

  const seriesPk = (team: GameTeam, seriesType: SeriesType): string => {
    return team.team.id + "-" + seriesType + "-" + team.seriesNumber
  }

  const gameToSeriesType = (game: Game): SeriesType => {
    return game.gameType == GameType.Regular
      ? SeriesType.RegularSeason
      : game.gameType == GameType.WildCardSeries
        ? SeriesType.WildCard
        : game.gameType == GameType.DivisionSeries
          ? SeriesType.Division
          : game.gameType == GameType.LeagueChampionshipSeries
            ? SeriesType.League
            : game.gameType == GameType.WorldSeries
              ? SeriesType.World
              : SeriesType.Unknown
  }

  const getCurrentSeries = (game: Game): Series => {
    if (game.teams == undefined) {
      throw new Error("Game has no teams")
    }

    // Get the existing series, or create a new one
    // Existing series may be a home/away, so will need to check if the pk is based
    // on either the most recent series being an alternate home/away.
    // Also need to ensure they're the same type of series; regular season, playoffs, etc.
    let currentSeries = seasonSeries.find((s) =>
      (s.pk == seriesPk(game.teams.home, gameToSeriesType(game)) || s.pk == seriesPk(game.teams.away, gameToSeriesType(game)))
      && s.type == gameToSeriesType(game))

    if (!currentSeries) {
      currentSeries = newSeries()
      currentSeries.pk = seriesPk(game.teams.home, gameToSeriesType(game))
      seasonSeries.push(currentSeries)
    }

    return currentSeries
  }

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
      currentSeries.startDate = game.gameDate!
      currentSeries.type = gameToSeriesType(game)
    }

    // Always update, we don't know if the last game of a scheduled series may end up postponed.
    currentSeries.endDate = game.gameDate!

    // Store this game into the series.
    currentSeries.games.push(game)
  })

  return seasonSeries
}

export default GenerateSeasonSeries