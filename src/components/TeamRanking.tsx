import { useCallback, useContext, useEffect, useState } from "react";
import { AppStateContext } from "../state/Context";
import { useParams } from "react-router-dom";
import { MlbApi, MLBRecord, MLBStandings, MLBStandingsList, MLBStandingsListFromJSON } from "@bp1222/stats-api";
import { LineChart, LineSeriesType } from "@mui/x-charts"
import LoadCachedData from "../services/caching";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";

const api = new MlbApi()

type Rankings = Record<string, number[]>

const TeamRanking = () => {
  const { state } = useContext(AppStateContext);
  const { seasonId, teamId } = useParams();

  const [seasonRankings, setSeasonRankings] = useState<Rankings>({})
  const [seasonDateRange, setSeasonDateRange] = useState<Date[]>([])

  const season = state.seasons.find((s) => s.seasonId == seasonId);
  const team = state.teams.find((t) => t.id == parseInt(teamId ?? ""),)!;

  const getSeasonRanking = useCallback(async () => {
    if (team == undefined) return;
    if (season == undefined) return;

    const newSeasonRankings: Rankings = {}
    const newSeasonDateRange: Date[] = []

    try {
      const result = await (await fetch("https://4jehxolf56.execute-api.us-east-2.amazonaws.com/Prod/" + season.seasonId + "/" + team.league?.id, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      })).json()

      Object.keys(result).forEach((k: string) => {
        newSeasonDateRange.push(new Date(k))
        result[k].forEach((s: MLBStandings) => {
          if (s.division.id != team.division?.id) return

          s.teamRecords.forEach((tr) => {
            if (newSeasonRankings[tr.team.name] == undefined) {
              newSeasonRankings[tr.team.name] = []
            }
            newSeasonRankings[tr.team.name].push(parseFloat(tr.divisionGamesBack != '-' ? tr.divisionGamesBack! : '0'))
          })
        })
      })
    } catch (err) {
      console.error(err)
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
    return (
      <Box display={"flex"} justifyContent={"center"}>
        <CircularProgress />
      </Box>
    );
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
