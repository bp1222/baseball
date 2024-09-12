import { useCallback, useContext, useEffect, useState } from "react";
import { AppStateContext } from "../state/Context";
import { useParams } from "react-router-dom";
import { MLBStandings } from "@bp1222/stats-api";
import { LineChart, LineSeriesType } from "@mui/x-charts"
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;

type Rankings = Record<string, number[]>

const TeamRanking = () => {
  const { state } = useContext(AppStateContext);
  const { seasonId, teamId } = useParams();

  const [seasonRankings, setSeasonRankings] = useState<Rankings>({})
  const [seasonDateRange, setSeasonDateRange] = useState<Date[]>([])
  const [loadError, setLoadError] = useState<boolean>(false)

  const season = state.seasons.find((s) => s.seasonId == seasonId);
  const team = state.teams.find((t) => t.id == parseInt(teamId ?? ""),)!;

  const getSeasonRanking = useCallback(async () => {
    if (team == undefined) return;
    if (season == undefined) return;

    const newSeasonRankings: Rankings = {}
    const newSeasonDateRange: Date[] = []

    try {
      const result = await (await fetch(import.meta.env.VITE_STANDINGS_API + "/" + season.seasonId + "/" + team.league?.id + "/" + team.division?.id, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      })).json()

      Object.keys(result).forEach((k: string) => {
        const s: MLBStandings = result[k]
        newSeasonDateRange.push(new Date(k))

        // This should now be taken care of by the cache.
        if (s.division.id != team.division?.id) return

        s.teamRecords.forEach((tr) => {
          if (newSeasonRankings[tr.team.name] == undefined) {
            newSeasonRankings[tr.team.name] = []
          }
          newSeasonRankings[tr.team.name].push(parseFloat(tr.divisionGamesBack != '-' ? tr.divisionGamesBack! : '0'))
        })
      })
    } catch (err) {
      console.error(err)
      setLoadError(true)
    }

    setSeasonDateRange(newSeasonDateRange)
    setSeasonRankings(newSeasonRankings)
  }, [team, season]);

  useEffect(() => {
    getSeasonRanking();
  }, [getSeasonRanking]);

  const getSeries = (): LineSeriesType[] => {
    const ret: LineSeriesType[] = []

    for (const k in seasonRankings) {
      ret.push({
        type: 'line',
        data: seasonRankings[k],
        label: k,
        showMark: false,
        curve: 'step',
      })
    }

    return ret
  }

  if (Object.keys(seasonRankings).length <= 0) {
    if (loadError) {
      return (
          <Box display={"flex"} justifyContent={"center"} marginBottom={1}>
            Error loading data, we may be loading the cache, please try again later.
          </Box>
      );
    } else {
      return (
          <Box display={"flex"} justifyContent={"center"} marginBottom={1}>
            <CircularProgress/>
          </Box>
      );
    }
  }

  return (
    <LineChart
      height={500}
      margin={{ top: 25, right: 25 }}
      series={getSeries()}
      grid={{ horizontal: true }}
      yAxis={[
        {
          label: 'Games Back',
          reverse: true,
        }
      ]}
      slotProps={{
        legend: {
          hidden: true,
        }
      }}
      xAxis={[
        {
          label: 'Day',
          scaleType: 'band',
          data: seasonDateRange,
          tickInterval: (date, index) => date?.getDate() == 1 || index == 0,
          tickLabelInterval: (date, index) => date?.getDate() == 1 || index == 0,
          valueFormatter: (date, context) =>
            context.location === 'tick'
              ? date.toLocaleString('en-us', { month: 'short' })
              : date.toLocaleDateString('en-us', { month: 'long', day: '2-digit' })
        }
      ]}
    />
  );
};

export default TeamRanking;
