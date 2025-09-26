import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import {Box} from "@mui/material"
import dayjs from "dayjs"
import {useEffect} from "react"

import {getGameLinescore} from "@/services/MlbAPI"
import {useAppStateApi} from "@/state"
import {Game} from "@/types/Game.ts"
import {GameStatus} from "@/types/Game/GameStatus.ts"

type GameStatusLineProps = {
  game: Game
}

export const GameStatusLine = ({game}: GameStatusLineProps) => {
  const {setLinescore} = useAppStateApi()

  useEffect(() => {
    if ([GameStatus.InProgress, GameStatus.Final].indexOf(game.gameStatus) > -1) {
      getGameLinescore(game).then((linescore) => {
        setLinescore(game.pk, linescore)
      })
    }
  }, [game, setLinescore])

  switch (game.gameStatus) {
    case GameStatus.Scheduled:
      // This seems to be a special date for games that don't have a scheduled time yet
      if (dayjs(game.gameDate).utc().format("h:mm A") == "7:33 AM") {
        return (
          <Box fontSize={"xx-small"}
               textAlign={"center"}
               color={"text.secondary"}>
            TBD
          </Box>
        )
      }

      return (
        <Box fontSize={"xx-small"}
             textAlign={"center"}
             color={"text.secondary"}>
          {dayjs(game.gameDate).format("h:mm A")}
        </Box>
      )
    case GameStatus.InProgress:
      return (
        <Box display={"flex"}
             alignItems={"center"}
             justifyContent={"space-evenly"}
             fontSize={"xx-small"}
             textAlign={"center"}
             color={"text.secondary"}>
          {game.linescore?.isTopInning ?
            <ArrowDropUpIcon sx={{width: ".6em", height: ".6em"}}/> :
            <ArrowDropDownIcon sx={{width: ".6em", height: ".6em"}}/>
          } {game.linescore?.currentInningOrdinal}
        </Box>
      )
    case GameStatus.Final:
      return (
        <Box display={"flex"}
             alignItems={"center"}
             justifyContent={"space-evenly"}
             fontSize={"xx-small"}
             textAlign={"center"}
             color={"text.secondary"}>
          F{((game.linescore?.innings?.length ?? 9) != (game.linescore?.scheduledInnings ?? 9)) ? "/" + game.linescore?.innings?.length : ""}
        </Box>
      )
    case GameStatus.Postponed:
      return (
        <Box display={"flex"}
             alignItems={"center"}
             justifyContent={"space-evenly"}
             fontSize={"xx-small"}
             textAlign={"center"}>
          Cancelled
        </Box>
      )
  }
}
