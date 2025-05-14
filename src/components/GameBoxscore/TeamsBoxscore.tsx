import {Box, Button, CircularProgress, Grid, ThemeProvider} from "@mui/material"
import {grey} from "@mui/material/colors"
import {Fragment, useEffect, useState} from "react"

import {GetTeamTheme} from "@/colors"
import {TeamBoxscore} from "@/components/GameBoxscore/TeamsBoxscore/TeamBoxscore.tsx"
import {getGameBoxscore} from "@/services/MlbAPI"
import {useAppStateApi, useAppStateUtil} from "@/state"
import {Game} from "@/types/Game.ts"
import {Team} from "@/types/Team.ts"

type GameBoxscores = {
  game: Game
}

enum Tab {
  Home,
  Away,
}

export const TeamsBoxscore = ({game}: GameBoxscores) => {
  const {setBoxscore} = useAppStateApi()
  const {getTeam} = useAppStateUtil()

  const [tab, setTab] = useState<Tab>(Tab.Away)

  useEffect(() => {
    getGameBoxscore(game).then((boxscore) => {
      setBoxscore(game.pk, boxscore)
    })
  }, [game, setBoxscore])

  const makeButton = (team: Team, loc: Tab) => {
    const selected = tab == loc
    const fontColor = selected ? "primary.main" : "black"
    const bgColor = selected ? "secondary.main" : grey[200]

    return (
      <ThemeProvider theme={GetTeamTheme(team.id)}>
        <Button
          onClick={() => {
            setTab(loc)
          }}
          sx={{
            border: 1,
            borderColor: "secondary.dark",
            borderRadius: 1,
            margin: 2,
            height: "1.5em",
            color: fontColor,
            backgroundColor: bgColor,
            fontWeight: selected ? "bold" : "",
            ":hover": {
              bgcolor: "secondary.light",
              fontColor: "primary.light",
            },
          }}
        >
          <Box>
            {team.franchiseName}
          </Box>
        </Button>
      </ThemeProvider>
    )
  }

  if (game.boxscore == undefined) {
    return <CircularProgress/>
  }

  return (
    <Fragment>
      <Grid textAlign={"center"}>
        {makeButton(getTeam(game.away.teamId)!, Tab.Away)}
        {makeButton(getTeam(game.home.teamId)!, Tab.Home)}
      </Grid>

      <Grid display={tab == Tab.Home ? "none" : "block"}>
        <TeamBoxscore boxscore={game.boxscore.away}/>
      </Grid>

      <Grid display={tab == Tab.Home ? "block" : "none"}>
        <TeamBoxscore boxscore={game.boxscore.home}/>
      </Grid>
    </Fragment>
  )
}