import {Box, Button, CircularProgress, Grid} from "@mui/material"
import {grey} from "@mui/material/colors"
import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"

import {SeriesList} from "@/components/SeriesList.tsx"
import TeamStats from "@/components/TeamStats.tsx"
import {useAppState} from "@/state"
import {Series} from "@/types/Series.ts"

enum Tab {
  Schedule,
  Stats,
}

// aug 21, 22, 23, 24, sept 22

// 630886, 630890, 630897, 630898, 630888

export {Team as default}
const Team = () => {
  const {seasonSeries} = useAppState()
  const {interestedTeamId} = useParams()

  const [series, setSeries] = useState<Series[]>([])

  const [tab, setTab] = useState<Tab>(Tab.Schedule)
  const isStatsTab = tab == Tab.Stats

  useEffect(() => {
    if (seasonSeries == undefined || interestedTeamId == undefined)
      return

    setSeries(seasonSeries
      .filter((s) => s.games
        .some((g) => g.away.teamId == parseInt(interestedTeamId) || g.home.teamId == parseInt(interestedTeamId))
      )
    )
  }, [seasonSeries, interestedTeamId])

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
        {(series?.length ?? 0) == 0 ? (
          <CircularProgress/>
        ) : (
          <Grid container
                flexGrow={1}
                columnSpacing={2}
                columns={{xs: 1, md: 3}}>

            <Grid display={{xs: isStatsTab ? "none" : "", md: "block"}} size={2}>
              <SeriesList series={series}/>
            </Grid>

            <Grid display={{xs: isStatsTab ? "block" : "none", md: "block"}} size={1}>
              <TeamStats/>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
