import {Boxscore, Game} from "@bp1222/stats-api"
import {Grid2, Typography} from "@mui/material"
import {useEffect, useState} from "react"

import {getGameBoxscore} from "@/services/MlbAPI"

import {GameLinescore} from "./components/GameLinescore.tsx"
import {Team} from "./components/Team"

type GameBoxscoreProps = {
  game: Game
}

export const GameBoxscore = ({game}: GameBoxscoreProps) => {
  const [boxscore, setBoxscore] = useState<Boxscore>()

  useEffect(() => {
    getGameBoxscore(game.gamePk).then((boxscore) => {
      setBoxscore(boxscore)
    })
  }, [game])

  console.log(boxscore)
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
