import {Game, GameStatusCode, Linescore} from "@bp1222/stats-api"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import {Box} from "@mui/material"

import dayjs from "@/utils/dayjs.ts"

type GameStatusLineProps = {
  game: Game
  linescore?: Linescore
}

export const GameStatusLine = ({ game, linescore }: GameStatusLineProps) => {
  switch (game.status.codedGameState) {
    case GameStatusCode.Scheduled:
    case GameStatusCode.Pregame:
      // This seems to be a special date for games that don't have a scheduled time yet
      if (dayjs(game.gameDate).utc().format("h:mm A") == "7:33 AM") {
        return
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
            <ArrowDropDownIcon sx={{width: ".6em", height: ".6em"}} />
          } {linescore?.currentInningOrdinal}
        </Box>
      )
    case GameStatusCode.Final:
      return (
        <Box display={"flex"}
             alignItems={"center"}
             justifyContent={"space-evenly"}
             fontSize={"xx-small"}
             textAlign={"center"}
             color={"text.secondary"}>
          F{((linescore?.innings?.length??9) != (linescore?.scheduledInnings??9)) ? "/" + linescore?.innings?.length : ""}
        </Box>
      )
    case GameStatusCode.Canceled:
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
