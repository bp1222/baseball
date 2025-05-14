import {Grid, Typography} from "@mui/material"

import {TeamsBoxscore} from "@/components/GameBoxscore/TeamsBoxscore.tsx"
import {Game} from "@/types/Game.ts"

import {BoxscoreTeam} from "./GameBoxscore/BoxscoreTeam.tsx"
import {GameLinescore} from "./GameBoxscore/GameLinescore.tsx"

type GameBoxscoreProps = {
  game: Game
}

export const GameBoxscore = ({game}: GameBoxscoreProps) => {
  return (
    <Grid container
          flexDirection={"column"}
          flexWrap={"nowrap"}
          alignItems={"center"}
          margin={"auto"}
          marginTop={"4vh"}
          minHeight={"70vh"}
          maxHeight={"90vh"}
          width={"95vw"}
          maxWidth={850}
          bgcolor={"Background"}
          padding={2}
          overflow={"auto"}
          border={"2px solid black"}
          borderRadius={2}>
      <Grid container
            id={game.pk + '-boxscore-teams'}
            alignItems={"center"}
            paddingTop={2}
            paddingBottom={2}>
        <BoxscoreTeam gameTeam={game.away}/>
        <Typography fontSize={"larger"}
                    paddingX={2}>
          @
        </Typography>
        <BoxscoreTeam gameTeam={game.home}/>
      </Grid>

      <Grid width={"90%"} paddingY={2}>
        <GameLinescore game={game}/>
      </Grid>

      <Grid width={"90%"}>
        <TeamsBoxscore game={game}/>
      </Grid>
    </Grid>
  )
}
