import { useContext, useEffect, useState} from "react";
import { AppStateContext } from "../state/Context";
import { useParams } from "react-router-dom";
import {MLBGameGameTypeEnum, MLBGameStatusCodedGameStateEnum, MLBTeam} from "@bp1222/stats-api";
import { LineChart, LineSeriesType } from "@mui/x-charts"
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import memoize from "fast-memoize"

type TeamDailyTally = {
  teamId: number,
  gameDifference: number
}

type DailyTally = {
  date: string,
  teams: TeamDailyTally[]
}

const findTeam = memoize((teams: MLBTeam[]|null, teamId: number): MLBTeam | undefined => {
  return teams?.find((t) => t.id == teamId);
});

const TeamRanking = () => {
  const { state } = useContext(AppStateContext);
  const { teamId } = useParams();
  const [standings, setStandings] = useState<DailyTally[]>()

  const team = findTeam(state.teams, parseInt(teamId ?? ""))

  useEffect(() => {
    const runningTallies: TeamDailyTally[] = []
    const dailyTallies: DailyTally[] = []

    const seenGames: number[] = []

    const getEmptyDivisionTally = (): TeamDailyTally[] => {
      const retval: TeamDailyTally[] = []
      state.teams?.forEach((t) => {
        if (t.division?.id == team?.division?.id) {
          retval.push({teamId: t.id, gameDifference: 0})
        }
      })
      return retval
    }

    const tallyGame = (date: string, team: MLBTeam, isWinner: boolean) => {
      // Init where necessary
      let teamRunningTally = runningTallies.find((t) => t.teamId == team.id)
      if (teamRunningTally == undefined) {
        teamRunningTally = {teamId: team.id, gameDifference: 0}
        runningTallies.push(teamRunningTally)
      }

      let dailyTally = dailyTallies.find((t) => t.date == date)
      if (dailyTally == undefined) {
        let init: TeamDailyTally[]
        if (dailyTallies.length > 0) {
          init = JSON.parse(JSON.stringify(dailyTallies[dailyTallies.length - 1].teams))
        } else {
          init = JSON.parse(JSON.stringify(getEmptyDivisionTally()))
        }
        dailyTally = {date: date, teams: init}
        dailyTallies.push(dailyTally)
      }

      // Do the actual manipulation
      if (isWinner) {
        teamRunningTally.gameDifference += 0.5
      } else {
        teamRunningTally.gameDifference -= 0.5
      }

      const teamDailyTally = dailyTally.teams.find((t) => t.teamId == team.id)!
      teamDailyTally.gameDifference = teamRunningTally.gameDifference
    }

    state.seasonSchedule?.dates?.forEach((date) => {
      // If we don't have a game
      if (date.date == undefined) return

      // Tally games played up until today.  Prior seasons will run through them all
      const seasonDay = new Date(date.date)
      if (seasonDay.getTime() >= new Date().getTime()) return

      // For each game that day
      date.games?.forEach((game) => {

        // If the game was not a regular season game, was postponed, or is not final, skip it
        if (game.gameType != MLBGameGameTypeEnum.Regular ||
          game.status?.codedGameState == MLBGameStatusCodedGameStateEnum.Postponed ||
          game.status?.codedGameState != MLBGameStatusCodedGameStateEnum.Final) {
          return
        }

        const awayTeam = findTeam(state.teams, game.teams.away.team.id)
        const homeTeam = findTeam(state.teams, game.teams.home.team.id)

        if (awayTeam == undefined || homeTeam == undefined) return

        // The gamePk will be the same for makeup games which were postponed, and suspended games.
        // Those games that get suspended on one day, and resume prior to the following days game,
        // will record the actual "Final" state in recorded games on _each_ day where the game was
        // played.  There is not a "Suspended" status like what Postponed games have, so we need to
        // track seen games here.  If we've already recorded a game, do not parse a duplicate
        if (game.gamePk) {
          if (seenGames.indexOf(game.gamePk) > 0) {
            return
          }
          seenGames.push(game.gamePk)
        }

        // Tally if the away team was in this division
        if (awayTeam.division?.id == team?.division?.id) {
          tallyGame(date.date!, awayTeam, game.teams.away.isWinner)
        }

        // Tally if the home team was in this division
        if (homeTeam.division?.id == team?.division?.id) {
          tallyGame(date.date!, homeTeam, game.teams.home.isWinner)
        }
      })
    })

    // Normalize the tallies to have division leader at zero, and the rest of the teams relative to that
    dailyTallies.forEach((dailyTally) => {
      const max = dailyTally.teams.reduce((acc, val) => Math.max(acc, val.gameDifference), 0)

      dailyTally.teams.forEach((team) => {
        team.gameDifference = Math.abs(team.gameDifference - max)
      })
    })

    setStandings(dailyTallies)
  }, [state.seasonSchedule, state.teams, team])

  if ((standings?.length ?? 0) <= 0) {
    return (
      <Box display={"flex"} justifyContent={"center"} marginBottom={1}>
        <CircularProgress/>
      </Box>
    );
  }

  const getSeries = (): LineSeriesType[] => {
    const ret: LineSeriesType[] = []

    const teams = standings?.[0].teams.map((t) => t.teamId)

    teams?.forEach((teamId) => {
      const team = findTeam(state.teams, teamId)
      ret.push({
        type: 'line',
        data: standings?.map((t) => t.teams.filter((team) => team.teamId == teamId).map((team) => team.gameDifference)[0]),
        label: team?.name,
        showMark: false,
        curve: 'step',
      })
    })
    return ret
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
          data: standings?.map((t) => new Date(t.date)),
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
