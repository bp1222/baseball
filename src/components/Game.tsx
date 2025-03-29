import {Game as apiGame, Team} from "@bp1222/stats-api"
import {Box, CircularProgress, Grid2, Modal} from "@mui/material"
import {lazy, Suspense, useState} from "react"

import {DefaultGameResultColor, GameResultColor} from "@/colors"
import {GameResult} from "@/types/Series/GameResult.ts"
import dayjs from "@/utils/dayjs.ts"

import {GameScore} from "./Game/GameScore.tsx"
import {GameStatusLine} from "./Game/GameStatusLine.tsx"

const GameBoxscore = lazy(() => import("@/components/GameBoxscore").then((module) => ({default: module.GameBoxscore})))

type SeriesGameProps = {
  result: GameResult
  game: apiGame
  home: Team
  away: Team

  // If we want to color the game box, or just the winners score
  interested?: Team

  // For outlining a day
  selectedDate?: dayjs.Dayjs
}

export const Game = ({result, game, interested, selectedDate}: SeriesGameProps) => {
  const getDay = (): string => {
    return dayjs(game.officialDate ?? "")
    .format("MMM DD")
    .toUpperCase()
  }

  const gameTileColor = interested
    ? GameResultColor[result]
    : [GameResult.InProgress, GameResult.Canceled, GameResult.GameOver, GameResult.Tie].indexOf(result) > -1
      ? GameResultColor[result]
      : DefaultGameResultColor

  const gameIsToday = dayjs(game.officialDate ?? "").isSame(interested ? dayjs() : selectedDate, "day")

  const [modelPopup, setModelPopup] = useState(false)

  return (
    <>
      <Modal open={modelPopup}
             disableAutoFocus={true}
             onClick={(e) => e.stopPropagation()}
             onClose={() => setModelPopup(false)}>
        <Box
          position={'absolute'}
          top={'50%'}
          left={'50%'}
          width={{xs: "80%", md: "60%"}}
          bgcolor={'Background'}
          border={'2px solid #000'}
          borderRadius={3}
          paddingY={2}
          paddingX={2}
          aria-selected={false}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}>
          <Suspense fallback={<CircularProgress/>}>
            <GameBoxscore game={game}/>
          </Suspense>
        </Box>
      </Modal>
      <Grid2 container
             display={"flex"}
             onClick={(e) => {
               setModelPopup(true)
               e.stopPropagation()
             }}
             sx={{cursor: "pointer"}}
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
          <GameScore gameTeam={game.teams?.away} gameStatus={game.status.codedGameState!} result={result}
                     color={interested != undefined}/>
        </Grid2>
        <Grid2>
          <GameScore gameTeam={game.teams?.home} gameStatus={game.status.codedGameState!} result={result}
                     color={interested != undefined}/>
        </Grid2>
        <Grid2>
          <GameStatusLine game={game}/>
        </Grid2>
      </Grid2>
    </>
  )
}