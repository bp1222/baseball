import {Box, Color, Stack} from "@mui/material"
import { GameResult } from "../../models/Series.ts"
import { MLBGame, MLBTeam } from "@bp1222/stats-api"
import {DefaultGameResultColor, GameResultColor } from "./colors.ts";

type SeriesGameProps = {
  result: GameResult
  game: MLBGame
  home: MLBTeam
  away: MLBTeam

  // If we want to color the game box, or just the winners score
  interested?: MLBTeam
}

export const SeriesGame = ({ result, game, home, away, interested }: SeriesGameProps) => {
  const getDay = (): string => {
    return new Date(game.officialDate ?? "")
      .toLocaleString("us", { month: "short", day: "numeric", timeZone: "utc" })
      .toUpperCase()
  }
  const color = interested ? GameResultColor[result] : DefaultGameResultColor

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
    ? color
    : (result == GameResult.Unplayed) || (result == GameResult.InProgress)
      ? DefaultGameResultColor
      : GameResultColor[GameResult.Win]
  const loserColor = interested
    ? color
    : (result == GameResult.Unplayed) || (result == GameResult.InProgress)
      ? DefaultGameResultColor
      : GameResultColor[GameResult.Loss]

  return (
    <Stack
      direction={"column"}
      marginTop={0.5}
      marginBottom={0.5}
      marginRight={1}
      height={"fit-content"}
      sx={{
        border: 1,
        borderRadius: 0.5,
        borderColor: color[200],
        backgroundColor: color[50],
        minWidth: 50,
        fontSize: "smaller",
      }}
    >
      <Box
        textAlign={"center"}
        sx={{
          backgroundColor: color[300],
          color: "Background",
          paddingLeft: 0.2,
          paddingRight: 0.2,
          textAlign: "center",
        }}
      >
        {getDay()}
      </Box>
      {renderScore(away?.abbreviation, game.teams?.away?.score, game.teams?.away?.isWinner ? winnerColor : loserColor)}
      {renderScore(home?.abbreviation, game.teams?.home?.score, game.teams?.home?.isWinner ? winnerColor : loserColor)}
    </Stack>
  )
}