import {Box, Color, Stack} from "@mui/material"
import {GameResult} from "../../models/Series.ts"
import {Game, GameStatusCode, Team} from "@bp1222/stats-api"
import {DefaultGameResultColor, GameResultColor} from "./colors.ts";

import dayjs from "../../utils/dayjs.ts"

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

  const renderScore = (name: string | undefined, score: number | undefined, scoreColor: Color) => {
    return (
      <Stack direction={"row"} sx={{ fontSize: "smaller", textAlign: "center" }}>
        <Box
          sx={{
            borderRight: 1,
            borderBottom: 1,
            backgroundColor: scoreColor[50],
            borderColor: scoreColor[100],
            color: scoreColor[700],
            width: "70%",
            paddingTop: 0.1,
          }}
        >
          {name}
        </Box>
        <Box
          sx={{
            borderBottom: 1,
            backgroundColor: scoreColor[50],
            borderColor: scoreColor[100],
            width: "30%",
            color: scoreColor[700],
            paddingTop: 0.1,
          }}
        >
          {score??0}
        </Box>
      </Stack>
    )
  }

  const winnerColor = interested
    ? GameResultColor[result]
    : game.status.codedGameState == GameStatusCode.Final
      ? GameResultColor[GameResult.Win]
      : DefaultGameResultColor

  const loserColor = interested
    ? GameResultColor[result]
    : game.status.codedGameState == GameStatusCode.Final
      ? GameResultColor[GameResult.Loss]
      : DefaultGameResultColor

  const gameTileColor = interested ? GameResultColor[result] : DefaultGameResultColor

  const gameIsToday = dayjs(game.officialDate ?? "").isSame(interested ? dayjs() : selectedDate, "day")

  return (
    <Stack
      direction={"column"}
      height={"fit-content"}
      minWidth={50}
      marginTop={0.5}
      marginBottom={0.5}
      marginRight={1}
      border={1}
      borderRadius={.5}
      borderColor={gameIsToday ? "black" : gameTileColor[200]}
      bgcolor={gameTileColor[50]}
      fontSize={"smaller"}
    >
      <Box
        textAlign={"center"}
        border={gameIsToday ?  1 : 0}
        color={"Background"}
        paddingLeft={0.2}
        paddingRight={0.2}
        bgcolor={gameTileColor[300]}
      >
        {getDay()}
      </Box>
      {renderScore(away?.abbreviation, game.teams?.away?.score, game.teams?.away?.isWinner ? winnerColor : loserColor)}
      {renderScore(home?.abbreviation, game.teams?.home?.score, game.teams?.home?.isWinner ? winnerColor : loserColor)}
    </Stack>
  )
}