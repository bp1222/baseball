import {Alert, Box, Button, CircularProgress, Grid, ThemeProvider} from "@mui/material"
import {grey} from "@mui/material/colors"
import {Fragment, useState} from "react"

import {GetTeamTheme} from "@/colors"
import {TeamBoxscore} from "@/components/GameBoxscore/TeamsBoxscore/TeamBoxscore.tsx"
import {useBoxscore} from "@/queries/boxscore.ts"
import {useTeam} from "@/queries/team.ts"
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
  const { data: homeTeam } = useTeam(game.home.teamId)
  const { data: awayTeam } = useTeam(game.away.teamId)
  const { data: boxscore , isPending, isError } = useBoxscore(game.pk)

  const [tab, setTab] = useState<Tab>(Tab.Away)

  const makeButton = (team: Team | undefined, loc: Tab) => {
    const selected = tab == loc
    const fontColor = selected ? "primary.main" : "black"
    const bgColor = selected ? "secondary.main" : grey[200]

    return (
      <ThemeProvider theme={GetTeamTheme(team?.id)}>
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
            {team?.franchiseName}
          </Box>
        </Button>
      </ThemeProvider>
    )
  }

  if (isPending) {
    return <CircularProgress/>
  } else if (isError) {
    return <Alert severity={"error"}>Error Loading Boxscore</Alert>
  }

  return (
    <Fragment>
      <Grid textAlign={"center"}>
        {makeButton(awayTeam, Tab.Away)}
        {makeButton(homeTeam, Tab.Home)}
      </Grid>

      <Grid display={tab == Tab.Home ? "none" : "block"}>
        <TeamBoxscore boxscore={boxscore.away}/>
      </Grid>

      <Grid display={tab == Tab.Home ? "block" : "none"}>
        <TeamBoxscore boxscore={boxscore.home}/>
      </Grid>
    </Fragment>
  )
}