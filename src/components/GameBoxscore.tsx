import {Game} from "@bp1222/stats-api"
import {Grid2, Typography} from "@mui/material"
import {Fragment} from "react"

import {GameLinescore} from "./GameBoxscore/GameLinescore.tsx"
import {Team} from "./GameBoxscore/Team.tsx"
import {TeamsBoxscore} from "./GameBoxscore/TeamsBoxscore.tsx"

type GameBoxscoreProps = {
  game: Game
}

export const GameBoxscore = ({game}: GameBoxscoreProps) => {
  return (
    <Fragment>
      <Grid2>
        <Grid2 container
               id={game.gamePk + '-boxscore-teams'}
               alignItems={"center"}
               paddingTop={2}
               paddingBottom={2}>
          <Team gameTeam={game?.teams?.away}/>
          <Typography fontSize={"larger"}
                      paddingX={2}>
            @
          </Typography>
          <Team gameTeam={game?.teams?.home}/>
        </Grid2>
      </Grid2>

      <Grid2 width={"90%"} paddingY={2}>
        <GameLinescore game={game}/>
      </Grid2>

      <Grid2 width={"90%"}>
        <TeamsBoxscore game={game}/>
      </Grid2>
    </Fragment>
  )
}
