import {Game, GameStatusCode, Linescore} from "@bp1222/stats-api"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import {Box, Grid2} from "@mui/material"

import dayjs from "../../utils/dayjs.ts"

type GameStatusLineProps = {
  game: Game
  linescore?: Linescore
}

const GameStatusLine = ({ game, linescore }: GameStatusLineProps) => {
  switch (game.status.codedGameState) {
    case GameStatusCode.Scheduled:
    case GameStatusCode.Pregame:
      // This seems to be a special date for games that don't have a scheduled time yet
      if (dayjs(game.gameDate).utc().format("h:mm A") == "7:33 AM") {
        return
      }

      return (
        <Grid2>
          <Box fontSize={"xx-small"}
               textAlign={"center"}
               color={"text.secondary"}>
            {dayjs(game.gameDate).format("h:mm A")}
          </Box>
        </Grid2>
      )
    case GameStatusCode.InProgress:
    case GameStatusCode.GameOver:
      return (
        <Grid2>
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
        </Grid2>
      )
    case GameStatusCode.Final:
      return (
        <Grid2>
          <Box display={"flex"}
               alignItems={"center"}
               justifyContent={"space-evenly"}
               fontSize={"xx-small"}
               textAlign={"center"}
               color={"text.secondary"}>
            F{(linescore?.innings?.length??0) != (linescore?.scheduledInnings??9) ? "/" + linescore?.innings?.length : ""}
          </Box>
        </Grid2>
      )
    case GameStatusCode.Canceled:
      return (
        <Grid2>
          <Box display={"flex"}
               alignItems={"center"}
               justifyContent={"space-evenly"}
               fontSize={"xx-small"}
               textAlign={"center"}>
            Cancelled
          </Box>
        </Grid2>
      )
  }
}

export default GameStatusLine