import {
  amber,
  blue,
  brown,
  grey,
  lightGreen,
  purple,
  red,
} from "@mui/material/colors";
import {
  MLBGame,
  MLBGameGameTypeEnum,
  MLBGameStatusCodedGameStateEnum,
  MLBGameTeam,
  MLBSchedule,
  MLBScheduleDay,
  MLBVenue,
} from "../services/MlbApi";
import { Color } from "@mui/material";

export enum SeriesResult {
  Win,
  Loss,
  Tie,
  Sweep,
  Swept,
  Unplayed,
  InProgress,
}

export const SeriesResultColor: { [key in SeriesResult]: Color } = {
  [SeriesResult.Win]: lightGreen,
  [SeriesResult.Loss]: red,
  [SeriesResult.Tie]: blue,
  [SeriesResult.Sweep]: amber,
  [SeriesResult.Swept]: brown,
  [SeriesResult.Unplayed]: grey,
  [SeriesResult.InProgress]: purple,
};

export enum SeriesHomeAway {
  Home,
  Away,
  Split,
}

export type Series = {
  result: SeriesResult;
  homeaway: SeriesHomeAway | undefined;
  against: MLBGameTeam;
  startDate: string;
  endDate: string;
  venue: MLBVenue;
  games: Game[];
};

export enum GameResult {
  Win,
  Loss,
  Tie,
  Unplayed,
  InProgress,
  GameOver,
}

export const GameResultColor: { [key in GameResult]: Color } = {
  [GameResult.Win]: lightGreen,
  [GameResult.Loss]: red,
  [GameResult.Tie]: blue,
  [GameResult.Unplayed]: grey,
  [GameResult.InProgress]: purple,
  [GameResult.GameOver]: amber,
};

export type Game = {
  result: GameResult;
  game: MLBGame;
};

/**
 *
 * @param schedule
 * @param team team which we are discerning results for, either they won or lost
 * @returns
 */
function GenerateSeries(schedule: MLBSchedule, teamId: number): Series[] {
  const newSeries = (): Series => {
    return {
      result: SeriesResult.Unplayed,
      homeaway: undefined,
      against: {},
      startDate: "",
      endDate: "",
      venue: {},
      games: [],
    };
  };

  const retval: Series[] = [];
  let currentSeries: Series = newSeries();

  let wins = 0;
  let losses = 0;

  schedule.dates?.forEach((day: MLBScheduleDay) => {
    day.games?.forEach((game: MLBGame) => {
      const isHome = (): boolean => {
        return game.teams?.home?.team?.id == teamId;
      };

      // Do not track postponed games, they apply to a future series
      if (
        game.status?.codedGameState == MLBGameStatusCodedGameStateEnum.Postponed
      ) {
        return null;
      }

      // TODO: Maybe allow spring training/postseason things
      // Do not track non-regular season games
      if (game.gameType != MLBGameGameTypeEnum.Regular) {
        return null;
      }

      // If the first game of the series, set the series start date, and teams
      if (game.seriesGameNumber == 1) {
        currentSeries.startDate = game.gameDate!;
        currentSeries.against = isHome()
          ? (game.teams?.away ?? {})
          : (game.teams?.home ?? {});
        currentSeries.venue = game.venue!;
      }

      // We need to decide if we're the home team, away team or a split series.
      // If we've already determined a split series, don't check again
      if (currentSeries.homeaway != SeriesHomeAway.Split) {
        if (isHome()) {
          if (currentSeries.homeaway == SeriesHomeAway.Away) {
            currentSeries.homeaway = SeriesHomeAway.Split;
          } else {
            currentSeries.homeaway = SeriesHomeAway.Home;
          }
        } else {
          if (currentSeries.homeaway == SeriesHomeAway.Home) {
            currentSeries.homeaway = SeriesHomeAway.Split;
          } else {
            currentSeries.homeaway = SeriesHomeAway.Away;
          }
        }
      }

      // If we're the home team, and the home team won, increment wins
      // else: if we weren't the home team and the we won increment wins
      // else: we lost :(
      const won =
        isHome() && game.teams?.home?.isWinner
          ? true
          : !isHome() && game.teams?.away?.isWinner
            ? true
            : false;

      if (
        game.status?.codedGameState == MLBGameStatusCodedGameStateEnum.Final
      ) {
        if (won) {
          wins++;
        } else {
          losses++;
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
      });

      // This is the last game of the series.  Note the date, decide disposition,
      // store this series as a return, setup for the next.
      if (game.gamesInSeries == game.seriesGameNumber) {
        currentSeries.endDate = game.gameDate!;

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
          if (wins + losses < (game.gamesInSeries as number)) {
            currentSeries.result = SeriesResult.InProgress;
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
                      : SeriesResult.Loss;
          }
        }

        // Push this series to the return
        retval.push(currentSeries);

        // Reset for the next series
        currentSeries = newSeries();

        wins = 0;
        losses = 0;
      }
    });
  });

  return retval;
}

export default GenerateSeries;
