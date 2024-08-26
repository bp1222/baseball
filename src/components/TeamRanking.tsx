import { useCallback, useContext, useEffect, useState } from "react";
import { AppStateContext } from "../state/Context";
import { useParams } from "react-router-dom";
import { MlbApi, MLBStandingsList } from "../services/MlbApi";
import { LineChart, LineSeriesType } from "@mui/x-charts"
import LoadCachedData from "../services/caching";
import { Box } from "@mui/system";
import { CircularProgress, Paper, TableContainer } from "@mui/material";

const api = new MlbApi()

type Rankings = {
  [index: string]: (number)[]
}

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

    const seasonStartDate = new Date(Date.parse(season!.regularSeasonStartDate!))
    const seasonEndDate = new Date(Date.parse(season!.regularSeasonEndDate!))

    const today = new Date()
    const endDate = seasonEndDate < today ? seasonEndDate : today

    const newSeasonRankings: Rankings = {}
    const newSeasonDateRange: Date[] = []

    for (let day = seasonStartDate; day <= endDate; ) {
      const date = day.toISOString().substring(0, 10)
      const key = "mlbStandings:" + season.seasonId + ":" + team.league?.id + ":" + date

      const standings = await LoadCachedData<MLBStandingsList>(key, day < today, () => api.getStandings({
        leagueId: team.league!.id!,
        season: season.seasonId!,
        date: date, 
        fields: [
          "records","division","id","team","name","teamRecords","leagueRecord","wins","losses","ties","pct","divisionGamesBack","gamesPlayed","magicNumber"
        ]
      }))

      if (standings?.records) {
        standings.records.forEach((r) => {
          // Only look at this teams division
          if (r.division.id != team.division?.id) return

          // Ignore days where no one in the division has played a game; looking at you Seoul Series.
          if (r.teamRecords.find((tr) => tr.wins != 0 || tr.losses != 0) == undefined) return

          r.teamRecords.forEach((tr) => {
            if (newSeasonRankings[tr.team.name] == undefined) {
              newSeasonRankings[tr.team.name] = []
            }
            newSeasonRankings[tr.team.name].push(parseFloat(tr.divisionGamesBack != '-' ? tr.divisionGamesBack! : '0'))
          })
        })
      }

      newSeasonDateRange.push(day)

      const nextDay = new Date(day)
      nextDay.setDate(day.getDate() + 1)
      day = nextDay
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
        curve: "stepAfter",
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
    <TableContainer component={Paper}>
      <Box border={2} height={500} borderColor={'secondary.light'}>
        <LineChart
          height={500}
          series={getSeries()}
          grid={{horizontal: true}}
          yAxis={[
            {
              reverse: true,
              label: 'Games Back',
            }
          ]}
          xAxis={[
              {
                scaleType: 'band',
                label: 'Day',
                data: seasonDateRange,
                tickInterval: (date, index) => date?.getDate() == 1 || index == 0,
                tickLabelInterval: (date, index) => date?.getDate() == 1 || index == 0,
                valueFormatter: (date, context) =>
                  context.location === 'tick'
                    ? date.toLocaleString('en-us', {month: 'short'})
                    : date.toLocaleDateString('en-us', {month: 'long', day: '2-digit'})
              }
            ]}
          />
      </Box>
    </TableContainer>
  );
};

export default TeamRanking;
