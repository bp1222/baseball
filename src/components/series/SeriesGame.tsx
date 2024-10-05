import {Game, GameStatusCode, Linescore, MlbApi, Team} from "@bp1222/stats-api"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import {Box, Color, Grid2} from "@mui/material"
import {useEffect, useState} from "react"

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

const mlbApi = new MlbApi()

export const SeriesGame = ({ result, game, home, away, interested, selectedDate }: SeriesGameProps) => {
  const [linescore, setLinescore] = useState<Linescore>()

  useEffect(() => {
    mlbApi.getLinescore({gamePk: game.gamePk}).then((linescore) => {
      setLinescore(linescore)
    })
  }, [game])

  const getDay = (): string => {
    return dayjs(game.officialDate ?? "")
      .format("MMM DD")
      .toUpperCase()
  }

  const renderScore = (name: string | undefined, score: number | undefined, scoreColor: Color) => {
    return (
      <Grid2 container
             fontSize={"x-small"}
             textAlign={"center"}>
        <Grid2 borderRight={1}
               borderBottom={1}
               borderColor={scoreColor[100]}
               bgcolor={scoreColor[50]}
               color={scoreColor[700]}
               width={"70%"}
               paddingTop={0.1}>
          {name}
        </Grid2>
        <Grid2 borderBottom={1}
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

  const renderLinescore = () => {
    switch (game.status.codedGameState) {
      case GameStatusCode.Scheduled:
      case GameStatusCode.Pregame:

        // This seems to be a special date for games that don't have a scheduled time yet
        if (dayjs(game.gameDate).utc().format("h:mm A") == "7:33 AM") {
          return <></>
        }

        return (
          <Box fontSize={"xx-small"}
               textAlign={"center"}
               color={"text.secondary"}>
            {dayjs(game.gameDate).format("h:mm A")}
          </Box>
        )
      case GameStatusCode.InProgress:
      case GameStatusCode.GameOver:
        return (
          <Box display={"flex"}
               alignItems={"center"}
               justifyContent={"space-evenly"}
               fontSize={"xx-small"}
               textAlign={"center"}
               color={"text.secondary"}>
            {linescore?.isTopInning ?
              <ArrowDropUpIcon sx={{width: ".6em", height: ".6em"}} /> :
              <ArrowDropDownIcon/>
            } {linescore?.currentInningOrdinal}
          </Box>
        )
    }
    return <></>
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
           border={.75}
           borderRadius={.5}
           maxHeight={"fit-content"}
           borderColor={gameIsToday ? "black" : gameTileColor[200]}
           bgcolor={gameTileColor[50]}>
      <Box flexGrow={1}
           fontSize={"smaller"}
           textAlign={"center"}
           color={"Background"}
           paddingLeft={0.2}
           paddingRight={0.2}
           bgcolor={gameTileColor[300]}>
        {getDay()}
      </Box>
      <Grid2>
        {renderScore(away?.abbreviation, game.teams?.away?.score, game.teams?.away?.isWinner ? winnerColor : loserColor)}
      </Grid2>
      <Grid2>
        {renderScore(home?.abbreviation, game.teams?.home?.score, game.teams?.home?.isWinner ? winnerColor : loserColor)}
      </Grid2>
      <Grid2>
        {renderLinescore()}
      </Grid2>
    </Grid2>
  )
}