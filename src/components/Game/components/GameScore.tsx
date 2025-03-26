import {GameStatusCode, GameTeam} from "@bp1222/stats-api"
import {Grid2} from "@mui/material"
import {useContext} from "react"

import {DefaultGameResultColor, GameResultColor} from "@/colors"
import {AppStateContext} from "@/state"
import {GameResult} from "@/types/Series"
import {GetTeam} from "@/utils/GetTeam"

type GameScoreProps = {
  gameTeam: GameTeam
  gameStatus: GameStatusCode
  result: GameResult
  color?: boolean
}

export const GameScore = ({gameTeam, gameStatus, result, color}: GameScoreProps) => {
  const {state} = useContext(AppStateContext)
  const scoreColor = color
    ? GameResultColor[result]
    : gameStatus == GameStatusCode.Final
      ? (gameTeam.isWinner ? GameResultColor[GameResult.Win] : GameResultColor[GameResult.Loss])
      : gameStatus == GameStatusCode.Canceled
        ? GameResultColor[GameResult.Canceled]
        : DefaultGameResultColor

  const team = GetTeam(state.teams, gameTeam.team.id)

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
        {team?.abbreviation}
      </Grid2>
      <Grid2 borderBottom={1}
             borderColor={scoreColor[100]}
             bgcolor={scoreColor[50]}
             color={scoreColor[700]}
             width={"30%"}
             paddingTop={0.1}>
        {gameTeam.score??0}
      </Grid2>
    </Grid2>
  )
}
