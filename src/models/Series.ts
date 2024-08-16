import { amber, blue, brown, grey, lightGreen, purple, red } from "@mui/material/colors"
import { Game, GameDate, GameTeam, Schedule, Team, Venue } from "../services/client-api"
import { Color } from "@mui/material"

export enum Result {
  Win,
  Loss,
  Tie,
  Sweep,
  Swept,
  Unplayed,
  InProgress,
}

export const ResultColor: { [key in Result]: Color } = {
  [Result.Win]: lightGreen,
  [Result.Loss]: red,
  [Result.Tie]: blue,
  [Result.Sweep]: amber,
  [Result.Swept]: brown,
  [Result.Unplayed]: grey,
  [Result.InProgress]: purple,
}

export enum SeriesHomeAway {
  Home,
  Away,
  Split,
}

enum GameType {
  SpringTraining = 'S',
  RegularSeason = 'R',
}

enum GameStatusState {
  Final = 'F',
  Postponed = 'D',
  Scheduled = 'S',
  InProgress = 'I',
  Pregame = 'P'
}

const GameStatusStateMap = {
  'F': GameStatusState.Final,
  'D': GameStatusState.Postponed,
  'S': GameStatusState.Scheduled,
  'I': GameStatusState.InProgress,
  'P': GameStatusState.Pregame,
}

export type SeriesGame = {
  result: Result
  status: GameStatusState
  game: Game
}

export type Series = {
  result: Result
  homeaway: SeriesHomeAway
  against: GameTeam | undefined
  startDate: string | undefined
  endDate: string | undefined
  venue: Venue | undefined
  games: SeriesGame[]
}

/**
 * 
 * @param schedule 
 * @param team team which we are discerning results for, either they won or lost
 * @returns 
 */
function GenerateSeries(schedule: Schedule, team: Team): Series[] {
  const newSeries = (): Series => {
    return {
      result: Result.Unplayed,
      homeaway: 0,
      against: {},
      startDate: '',
      endDate: '',
      venue: {},
      games: [],
    }
  }

  const retval: Series[] = []
  let currentSeries: Series = newSeries()

  let wins = 0
  let losses = 0

  schedule.dates?.forEach((day: GameDate) => {
    day.games?.forEach((game: Game) => {
      const isHome = (): boolean => {
        return game.teams?.home?.team?.id == team.id
      }

      // Do not track postponed games, they apply to a future series
      if (game.status?.codedGameState == GameStatusState.Postponed) {
        return
      }

      // TODO: Maybe allow spring training/postseason things
      // Do not track non-regular season games
      if (game.gameType != GameType.RegularSeason) {
        return
      }

      // If the first game of the series, set the series start date, and teams
      if (game.seriesGameNumber == 1) {
        currentSeries!.startDate = game.gameDate
        currentSeries.against = isHome() ? game.teams?.away : game.teams?.home
        currentSeries.venue = game.venue
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
      const won = isHome() && game.teams?.home?.isWinner ? true : (!isHome() && game.teams?.away?.isWinner ? true : false)

      if (game.status?.codedGameState == GameStatusState.Final) {
        if (won) {
          wins++;
        } else {
          losses++
        }
      }

      // Store this game into the series.
      currentSeries.games.push({
        result: game.status?.codedGameState != GameStatusState.Final ? Result.Unplayed : (won ? Result.Win : Result.Loss),
        status: GameStatusStateMap[game.status!.codedGameState! as GameStatusState],
        game: game
      })


      // This is the last game of the series.  Note the date, decide disposition,
      // store this series as a return, setup for the next.
      if (game.gamesInSeries == game.seriesGameNumber) {
        currentSeries.endDate = game.gameDate

        // Determine the series disposition:
        // Are both wins && losses 0? If so, we haven't played this series yet.
        // Are the total of wins+losses less than games in series?  We're in progress
        // Otherwise:
        // Did we have no losses this series? SWEEP
        // Did we have no wins this series? SWEPT (oof)
        // Did we have more wins than losses? Win!
        // Did we equal losses? Tie
        // Otherwise we lost
        if (losses != 0 || wins != 0) {
          if ((wins + losses) < (game.gamesInSeries as number)) {
            currentSeries.result = Result.InProgress
          } else {
            currentSeries.result = losses == 0 ? Result.Sweep : (
              wins == 0 ? Result.Swept : (
                wins > losses ? Result.Win : (
                  wins == losses ? Result.Tie : Result.Loss
                )
              )
            )
          }
        }

        // Push this series to the return 
        retval.push(currentSeries)

        // Reset for the next series
        currentSeries = newSeries()

        wins = 0
        losses = 0
      }
    })
  })

  return retval
}

export default GenerateSeries