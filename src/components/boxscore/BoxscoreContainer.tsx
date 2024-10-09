import {Game, Linescore} from "@bp1222/stats-api"
import {Grid2, Typography} from "@mui/material"

import BoxscoreLinescore from "./BoxscoreLinescore.tsx"
import BoxscoreTeam from "./BoxscoreTeam.tsx"

type GameBoxscoreProps = {
  game: Game
  linescore?: Linescore
}

const BoxscoreContainer = ({ game, linescore }: GameBoxscoreProps) => {
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
        <BoxscoreTeam gameTeam={game?.teams?.away} />
        <Typography fontSize={"larger"}
                    paddingX={2}
        >
          @
        </Typography>
        <BoxscoreTeam gameTeam={game?.teams?.home} />
      </Grid2>

      <BoxscoreLinescore game={game} linescore={linescore} />
    </Grid2>
  )
}

export default BoxscoreContainer