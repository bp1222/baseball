import { Grid, Stack } from "@mui/material"
import { MlbApi } from "../services/client-api"
import { useEffect, useCallback, useContext, useState } from "react"
import { AppStateContext } from "../AppContext"
import GenerateSeries, { Series } from "../models/Series"
import SeriesItem from "./SeriesItem"

const api = new MlbApi()

function TeamSchedule() {
  const { state } = useContext(AppStateContext)
  const [series, setSeries] = useState<Series[]>([])

  const getSchedule = useCallback(async () => {
    if (state.team.id == undefined) return;
    if (state.season.seasonId == undefined) return;
    const schedule = await api.getSchedules({ sportId: 1, teamId: state.team.id, startDate: state.season.regularSeasonStartDate, endDate: state.season.regularSeasonEndDate })
    setSeries(GenerateSeries(schedule, state.team))
  }, [state.team, state.season])

  useEffect(() => {
    getSchedule()
  }, [state.team, state.season])

  if (series?.length > 0) {
    const pivot = Math.ceil(series!.length / 2)
    const [firstHalf, secondHalf] = [series?.slice(0, pivot), series?.slice(pivot, series?.length)];
    return (
      <Grid container paddingTop={1} columnSpacing={2}>
        <Grid item xs={6}>
          <Stack direction={"column"} spacing={1}>
            {firstHalf?.map((s) => <SeriesItem key={s.startDate} series={s} />)}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction={"column"} spacing={1}>
            {secondHalf?.map((s) => <SeriesItem key={s.startDate} series={s} />)}
          </Stack>
        </Grid>
      </Grid>
    )
  }
  return <></>
}

export default TeamSchedule
