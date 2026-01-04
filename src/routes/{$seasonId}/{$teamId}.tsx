import {Box, Button, CircularProgress, Grid} from "@mui/material"
import {grey} from "@mui/material/colors"
import {createFileRoute} from "@tanstack/react-router"
import React, {useState} from "react"

import {SeriesList} from "@/components/SeriesList.tsx"
import {TeamStats} from "@/components/TeamStats.tsx"
import {useSchedule} from "@/queries/schedule.ts"
import {seasonsOptions} from "@/queries/season.ts"
import {teamsOptions} from "@/queries/team.ts"

enum Tab {
  Schedule,
  Stats,
}

const TeamComponent = () => {
  const { teamId: interestedTeamId } = Route.useParams()
  let { data: seasonSeries } = useSchedule()

  const [tab, setTab] = useState<Tab>(Tab.Schedule)

  if (interestedTeamId) {
    seasonSeries = seasonSeries?.filter(
      (s) => s.games.some(
        (g) => g.away.teamId == interestedTeamId || g.home.teamId == interestedTeamId
      )
    )
  }

  const makeButton = (text: string, loc: Tab) => {
    const selected = tab == loc
    const bgColor = selected ? "secondary.main" : grey[200]

    return (
      <Button
        onClick={() => {
          setTab(loc)
        }}
        sx={{
          minWidth: "20%",
          border: 1,
          borderColor: "secondary.dark",
          borderRadius: 4,
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

  return (
      <Box>
        <Grid container
              display={{sm: "flex", md: "none"}}
              flexGrow={1}
              flexDirection={"row"}
              textAlign={"center"}
              justifyContent={"center"}
              spacing={2}
              paddingBottom={2}>
          {makeButton("schedule", Tab.Schedule)}
          {makeButton("stats", Tab.Stats)}
        </Grid>

        <Grid container
              justifyContent={"center"}>
          {(seasonSeries?.length ?? 0) == 0 ? (
            <CircularProgress/>
          ) : (
            <Grid container
                  flexGrow={1}
                  columnSpacing={2}
                  columns={{xs: 1, md: 3}}>

              <Grid display={{xs: tab == Tab.Stats ? "none" : "", md: "block"}} size={2}>
                <SeriesList series={seasonSeries!}/>
              </Grid>

              <Grid display={{xs: tab == Tab.Stats ? "block" : "none", md: "block"}} size={1}>
                <TeamStats />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
  )
}

export const Route = createFileRoute('/{$seasonId}/{$teamId}')({
  loader: ({ context: { queryClient, defaultSeason }, params: { seasonId } }) => {
    queryClient.ensureQueryData(seasonsOptions)
    queryClient.ensureQueryData(teamsOptions(seasonId ?? defaultSeason))
  },
  component: TeamComponent,
})