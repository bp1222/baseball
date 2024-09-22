import {
  MLBGame,
  MLBGameGameTypeEnum,
  MLBGameStatusCodedGameStateEnum,
  MLBGameTeam,
  MLBTeam,
} from "@bp1222/stats-api"

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

export type Series = {
  pk: number
  result: SeriesResult
  homeaway: SeriesHomeAway
  type: SeriesType
  against: MLBGameTeam|undefined
  startDate: string
  endDate: string
  games: Game[]
}

export enum GameResult {
  Win,
  Loss,
  Tie,
  Unplayed,
  InProgress,
  GameOver,
}

export type Game = {
  result: GameResult
  game: MLBGame
}

/**
 *
 * @param schedule
 * @param team team which we are discerning results for, either they won or lost
 * @returns
 */
function GenerateSeries(schedule: MLBGame[], team: MLBTeam): Series[] {
  const newSeries = (): Series => {
    return {
      pk: 0,
      result: SeriesResult.Unplayed,
      homeaway: SeriesHomeAway.Unknown,
      type: SeriesType.Unknown,
      against: undefined,
      startDate: "",
      endDate: "",
      games: [],
    }
  }

  const retval: Series[] = []
  let currentSeries: Series = newSeries()

  let wins = 0
  let losses = 0

  // Suspended games don't denote as such, and are duplicated
  const seenGames: number[] = []

  schedule.forEach((game: MLBGame) => {
    const isHome = (): boolean => {
      return game.teams?.home?.team?.id == team.id
    }

    if (
      game.gameType == MLBGameGameTypeEnum.SpringTraining ||
      game.gameType == MLBGameGameTypeEnum.Exhibition
    ) {
      return
    }

    // Do not track postponed games, they apply to a future series
    if (
      game.status?.codedGameState == MLBGameStatusCodedGameStateEnum.Postponed
    ) {
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

    // If the first game of the series, set the series start date, and teams
    if (game.seriesGameNumber == 1) {
      currentSeries.startDate = game.gameDate!
      currentSeries.type =
        game.gameType == MLBGameGameTypeEnum.Regular
          ? SeriesType.RegularSeason
          : game.gameType == MLBGameGameTypeEnum.WildCardSeries
            ? SeriesType.WildCard
            : game.gameType == MLBGameGameTypeEnum.DivisionSeries
              ? SeriesType.Division
              : game.gameType == MLBGameGameTypeEnum.LeagueChampionshipSeries
                ? SeriesType.League
                : game.gameType == MLBGameGameTypeEnum.WorldSeries
                  ? SeriesType.World
                  : SeriesType.Unknown

      currentSeries.against = isHome()
        ? (game.teams?.away ?? {})
        : (game.teams?.home ?? {})

      currentSeries.pk = game.gamePk
    }

    // We need to decide if we're the home team, away team or a split series.
    // If we've already determined a split series, don't check again
    if (currentSeries.homeaway != SeriesHomeAway.Split) {
      if (isHome()) {
        if (currentSeries.homeaway == SeriesHomeAway.Away) {
          currentSeries.homeaway = SeriesHomeAway.Split
        } else {
          currentSeries.homeaway = SeriesHomeAway.Home
        }
      } else {
        if (currentSeries.homeaway == SeriesHomeAway.Home) {
          currentSeries.homeaway = SeriesHomeAway.Split
        } else {
          currentSeries.homeaway = SeriesHomeAway.Away
        }
      }
    }

    // If we're the home team, and the home team won, increment wins
    // else: if we weren't the home team and the we won increment wins
    // else: we lost :(
    const won =
      isHome() && game.teams?.home?.isWinner
        ? true
        : !!(!isHome() && game.teams?.away?.isWinner)

    if (
      game.status?.codedGameState == MLBGameStatusCodedGameStateEnum.Final
    ) {
      if (won) {
        wins++
      } else {
        losses++
      }
    }

    // Store this game into the series.
    currentSeries.games.push({
      result:
        game.status?.codedGameState ==
        MLBGameStatusCodedGameStateEnum.InProgress
          ? GameResult.InProgress
          : game.status?.codedGameState ==
          MLBGameStatusCodedGameStateEnum.GameOver
            ? GameResult.GameOver
            : game.status?.codedGameState !=
            MLBGameStatusCodedGameStateEnum.Final
              ? GameResult.Unplayed
              : won
                ? GameResult.Win
                : GameResult.Loss,
      game: game,
    })

    // Determine the series disposition:
    // We can possibly discern a series result early
    // i.e. won 2 of a 3 game series, we can safely denote a win.
    //
    // Are both wins && losses 0? If so, we haven't played this series yet.
    // Are the total of wins+losses less than games in series?  We're in progress
    // Otherwise:
    // Did we have no losses this series? SWEEP
    // Did we have no wins this series? SWEPT (oof)
    // Did we have more wins than losses? Win!
    // Did we equal losses? Tie
    // Otherwise we lost
    if (losses != 0 || wins != 0) {
      if (
        wins + losses < (game.gamesInSeries as number)
      ) {
        const det = Math.ceil((game.gamesInSeries+1) / 2)
        currentSeries.result =
          game.seriesGameNumber >= det
            ? wins >= det
              ? SeriesResult.Win
              : losses >= det
                ? SeriesResult.Loss
                : SeriesResult.InProgress
            : SeriesResult.InProgress
      } else {
        currentSeries.result =
          losses == 0
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

    // Is this the end of the series?
    // Simple answer is if the pre-determined games in series is this game number.
    //   - This is handled in-season by postponed end games of a series decrementing
    //     the series count for the last game in the series that wasn't postponed.
    //   - This is handled different for postseason games, where it will always list
    //     the series as the max length.  So if a WildCard Series is won in 2 games
    //     there will only be the 2 games, both with a `3` listed for gamesInSeries
    const endOfSeries = (): boolean => {
      if (game.gamesInSeries == game.seriesGameNumber) {
        return true
      }

      if (
        game.gameType == MLBGameGameTypeEnum.WildCardSeries &&
        (wins == 2 || losses == 2)
      ) {
        return true
      }
      if (
        game.gameType == MLBGameGameTypeEnum.DivisionSeries &&
        (wins == 3 || losses == 3)
      ) {
        return true
      }
      if (
        (game.gameType == MLBGameGameTypeEnum.LeagueChampionshipSeries ||
          game.gameType == MLBGameGameTypeEnum.WorldSeries) &&
        (wins == 4 || losses == 4)
      ) {
        return true
      }
      return false
    }


    if (endOfSeries()) {
      currentSeries.endDate = game.gameDate!

      // Push this series to the return
      retval.push(currentSeries)

      // Reset for the next series
      currentSeries = newSeries()

      wins = 0
      losses = 0
    }
  })

  return retval
}

export default GenerateSeries
