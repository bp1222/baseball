import {Game, GameStatusCode, Team} from "@bp1222/stats-api"
import { Color, Grid2, Typography} from "@mui/material"

import {GameResult} from "../../models/Series.ts"
import dayjs from "../../utils/dayjs.ts"
import {DefaultGameResultColor, GameResultColor} from "./colors.ts"

type SeriesGameProps = {
  result: GameResult
  game: Game
  home: Team
  away: Team

  // If we want to color the game box, or just the winners score
  interested?: Team

  // For outlining a day
  selectedDate?: dayjs.Dayjs
}

export const SeriesGame = ({ result, game, home, away, interested, selectedDate }: SeriesGameProps) => {
  const getDay = (): string => {
    return dayjs(game.officialDate ?? "")
      .format("MMM DD")
      .toUpperCase()
  }
  /*
  <Grid2 container
         flexGrow={1}
         justifyContent={"flex-end"}
         alignContent={"space-evenly"}
         flexWrap={"wrap"}>
  </Grid2>
   */

  const renderScore = (name: string | undefined, score: number | undefined, scoreColor: Color) => {
    return (
      <Grid2
             display={"flex"}
             flexGrow={1}
             flexWrap={"wrap"}>
        <Grid2 fontSize={"x-small"}
               textAlign={"center"}
               borderRight={1}
               borderBottom={1}
               borderColor={scoreColor[100]}
               bgcolor={scoreColor[50]}
               color={scoreColor[700]}
               width={"70%"}
               paddingTop={0.1}>
          {name}
        </Grid2>
        <Grid2 fontSize={"x-small"}
               textAlign={"center"}
               borderBottom={1}
               borderColor={scoreColor[100]}
               bgcolor={scoreColor[50]}
               color={scoreColor[700]}
               width={"30%"}
               paddingTop={0.1}>
          {score??0}
        </Grid2>
      </Grid2>
    )
  }

  const winnerColor = interested
    ? GameResultColor[result]
    : game.status.codedGameState == GameStatusCode.Final
      ? GameResultColor[GameResult.Win]
      : game.status.codedGameState == GameStatusCode.Canceled
        ? GameResultColor[GameResult.Canceled]
        : DefaultGameResultColor

  const loserColor = interested
    ? GameResultColor[result]
    : game.status.codedGameState == GameStatusCode.Final
      ? GameResultColor[GameResult.Loss]
      : game.status.codedGameState == GameStatusCode.Canceled
        ? GameResultColor[GameResult.Canceled]
        : DefaultGameResultColor

  const gameTileColor = interested
    ? GameResultColor[result]
    : [GameResult.InProgress, GameResult.Canceled, GameResult.GameOver, GameResult.Tie].indexOf(result) > -1
      ? GameResultColor[result]
      : DefaultGameResultColor

  const gameIsToday = dayjs(game.officialDate ?? "").isSame(interested ? dayjs() : selectedDate, "day")

  return (
    <Grid2 container
           display={"flex"}
           flexDirection={"column"}
           maxWidth={50}
           minWidth={50}
           marginTop={0.75}
           marginBottom={0.75}
           marginRight={1}
           border={1}
           borderRadius={.5}
           borderColor={gameIsToday ? "black" : gameTileColor[200]}
           bgcolor={gameTileColor[50]}>
      <Typography flexGrow={1}
                  fontSize={"smaller"}
                  textAlign={"center"}
                  border={gameIsToday ?  1 : 0}
                  color={"Background"}
                  paddingLeft={0.2}
                  paddingRight={0.2}
                  bgcolor={gameTileColor[300]}>
        {getDay()}
      </Typography>
      {renderScore(away?.abbreviation, game.teams?.away?.score, game.teams?.away?.isWinner ? winnerColor : loserColor)}
      {renderScore(home?.abbreviation, game.teams?.home?.score, game.teams?.home?.isWinner ? winnerColor : loserColor)}
    </Grid2>
  )
}