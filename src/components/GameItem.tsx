import {Box, CircularProgress, Color, Grid, Modal} from "@mui/material"
import dayjs from "dayjs"
import {lazy, Suspense, useState} from "react"
import {useParams} from "react-router-dom"

import {useAppStateUtil} from "@/state"
import {Game} from "@/types/Game.ts"
import {DefaultGameResultColor, GetGameResultColor} from "@/types/Game/GameResult.ts"
import {GameStatus, GetGameStatusColor} from "@/types/Game/GameStatus.ts"

import {GameScore} from "./GameItem/GameScore.tsx"
import {GameStatusLine} from "./GameItem/GameStatusLine.tsx"

const GameBoxscore = lazy(() => import("@/components/GameBoxscore").then((module) => ({default: module.GameBoxscore})))

type SeriesGameProps = {
  game: Game
  selectedDate?: dayjs.Dayjs
}

export const GameItem = ({game, selectedDate}: SeriesGameProps) => {
  const {getTeam} = useAppStateUtil()
  const {interestedTeamId} = useParams()

  const gameIsToday = dayjs(game.gameDate).isSame(interestedTeamId ? dayjs() : selectedDate, "day")
  const [modelPopup, setModelPopup] = useState(false)

  const interestedTeam = getTeam(interestedTeamId)
  const gameTileColor: Color = interestedTeam
    ? GetGameResultColor(game, interestedTeam)
    : [GameStatus.InProgress, GameStatus.Canceled].indexOf(game.gameStatus) > -1
      ? GetGameStatusColor(game.gameStatus)
      : DefaultGameResultColor

  return (
    <Grid container
          onClick={(e) => {
            setModelPopup(true)
            e.stopPropagation()
          }}
          id={game.pk + '-game'}
          sx={{cursor: "pointer"}}
          flexDirection={"column"}
          width={50}
          marginTop={0.75}
          marginBottom={0.75}
          marginRight={1}
          border={.75}
          borderRadius={.5}
          borderColor={gameIsToday ? "black" : gameTileColor[200]}
          bgcolor={gameTileColor[50]}>
      <Modal open={modelPopup}
             disableAutoFocus={true}
             onClick={(e) => e.stopPropagation()}
             onClose={() => setModelPopup(false)}>
        <Suspense fallback={<CircularProgress/>}>
          <GameBoxscore game={game}/>
        </Suspense>
      </Modal>
      <Box flexGrow={1}
           fontSize={"smaller"}
           textAlign={"center"}
           color={"Background"}
           paddingLeft={0.2}
           paddingRight={0.2}
           bgcolor={gameTileColor[300]}>
        {dayjs(game.gameDate)
        .format("MMM DD")
        .toUpperCase()}
      </Box>
      <Grid>
        <GameScore gameTeam={game.away}
                   color={GetGameResultColor(game, interestedTeam ?? getTeam(game.away.teamId)!)}/>
      </Grid>
      <Grid>
        <GameScore gameTeam={game.home}
                   color={GetGameResultColor(game, interestedTeam ?? getTeam(game.home.teamId)!)}/>
      </Grid>
      <Grid>
        <GameStatusLine game={game}/>
      </Grid>
    </Grid>
  )
}