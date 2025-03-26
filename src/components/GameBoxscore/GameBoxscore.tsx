import {Game, Linescore as apiLinescore} from "@bp1222/stats-api"
import {Grid2, Typography} from "@mui/material"

import {Linescore} from "./components/Linescore"
import {Team} from "./components/Team"

type GameBoxscoreProps = {
  game: Game
  linescore?: apiLinescore
}

export const GameBoxscore = ({game, linescore}: GameBoxscoreProps) => {
  return (
    <Grid2 container
           id={game.gamePk + '-boxscore'}
           flexDirection={"column"}
           alignItems={"center"}
           flexGrow={1}
    >
      <Grid2 container
             id={game.gamePk + '-boxscore-teams'}
             alignItems={"center"}
             alignContent={"center"}
             flexDirection={"row"}
             paddingY={2}
      >
        <Team gameTeam={game?.teams?.away}/>
        <Typography fontSize={"larger"}
                    paddingX={2}
        >
          @
        </Typography>
        <Team gameTeam={game?.teams?.home}/>
      </Grid2>

      <Linescore game={game} linescore={linescore}/>
    </Grid2>
  )
}
