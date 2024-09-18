import {Box, CircularProgress, Grid} from "@mui/material";
import {AppStateContext} from "../state/Context.tsx";
import {useContext, useEffect, useState} from "react";
import GenerateSeries, {Series} from "../models/Series.ts";
import SeriesItem from "./SeriesItem.tsx";


const CurrentSeries = () => {
  const {state} = useContext(AppStateContext);

  const [currentSeries, setCurrentSeries] = useState<Series[]|undefined>();

  useEffect(() => {
    const today = new Date()

    const todaysGames = state.seasonSchedule?.dates.flatMap((d) => d.games).filter((g) => {
      const gameDate = new Date(g.gameDate)
      return gameDate.getFullYear() == today.getFullYear() && gameDate.getMonth() == today.getMonth() && gameDate.getDate() == today.getDate()
    })

    console.log(todaysGames)

    const activeSeries = todaysGames?.map((game) => {
      return state.seasonSchedule?.dates.flatMap((d) => d.games).filter((g) => {
        return g.teams.home.team.id == game.teams.home.team.id && g.teams.home.seriesNumber == game.teams.home.seriesNumber
      })
    })

    const generatedSeries = activeSeries?.flatMap((series) => {
      if (series == undefined) return
      const team = state.teams?.find((t) => t.id == series[0].teams.home.team.id)
      return GenerateSeries(series, team!)
    }) as Series[]|undefined

    setCurrentSeries(generatedSeries)
  }, [state.seasonSchedule])

  if ((currentSeries?.length ?? 0) == 0) {
    return (
      <Box display={"flex"} justifyContent={"center"}>
        <CircularProgress/>
      </Box>
    );
  }

  return (
    <Grid container flexWrap={"wrap"} columns={2}>
      {currentSeries?.map((series) => (
        <Grid xs={1} padding={1} key={series.pk} item>
          <SeriesItem series={series} interested={series.team?.team}/>
        </Grid>
      ))}
    </Grid>
  )
};

export default CurrentSeries;
