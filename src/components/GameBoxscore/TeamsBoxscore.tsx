import {Boxscore, Game} from "@bp1222/stats-api"
import {Box, Button, Grid2} from "@mui/material"
import {grey} from "@mui/material/colors"
import {Fragment, useEffect, useState} from "react"

import {TeamBoxscore} from "@/components/GameBoxscore/TeamsBoxscore/TeamBoxscore.tsx"
import {getGameBoxscore} from "@/services/MlbAPI"

type GameBoxscores = {
  game: Game
}

enum Tab {
  Home,
  Away,
}

export const TeamsBoxscore = ({game}: GameBoxscores) => {
  const [boxscore, setBoxscore] = useState<Boxscore>()
  const [tab, setTab] = useState<Tab>(Tab.Away)

  useEffect(() => {
    getGameBoxscore(game.gamePk).then((boxscore) => {
      setBoxscore(boxscore)
    })
  }, [game])

  const makeButton = (text: string, loc: Tab) => {
    const selected = tab == loc
    const bgColor = selected ? "secondary.main" : grey[200]

    return (
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
          backgroundColor: bgColor,
          fontWeight: selected ? "bold" : "",
          ":hover": {
            bgcolor: grey[400],
          },
        }}
      >
        <Box>
          {text}
        </Box>
      </Button>
    )
  }

  if (boxscore == undefined || boxscore.teams == undefined) {
    return <></>
  }

  return (
    <Fragment>
      <Grid2 textAlign={"center"}>
        {makeButton(game.teams.away.team.clubName!, Tab.Away)}
        {makeButton(game.teams.home.team.clubName!, Tab.Home)}
      </Grid2>

      <Grid2 display={tab == Tab.Home ? "none" : "block"}>
        <TeamBoxscore boxscore={boxscore.teams.away}/>
      </Grid2>

      <Grid2 display={tab == Tab.Home ? "block" : "none"}>
        <TeamBoxscore boxscore={boxscore.teams.home}/>
      </Grid2>
    </Fragment>
  )
}