import {Game} from "@bp1222/stats-api"
import {Grid2, Typography} from "@mui/material"

import {GameLinescore} from "./GameBoxscore/GameLinescore.tsx"
import {Team} from "./GameBoxscore/Team.tsx"

type GameBoxscoreProps = {
  game: Game
}

export const GameBoxscore = ({game}: GameBoxscoreProps) => {
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

      <GameLinescore game={game}/>

      <Grid2 container>

      </Grid2>
    </Grid2>
  )
}
