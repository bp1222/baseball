import {GameStatusCode, GameType, Team} from "@bp1222/stats-api"
import {Grid2, Paper, TableContainer, Typography} from "@mui/material"
import { LineChart, LineSeriesType } from "@mui/x-charts"
import {useContext, useMemo} from "react"
import { useParams } from "react-router-dom"

import { AppStateContext } from "../../state/Context.tsx"
import dayjs from "../../utils/dayjs.ts"
import { FindTeam } from "../../utils/findTeam.ts"

type TeamDailyTally = {
  teamId: number,
  gameDifference: number
}

type DailyTally = {
  date: dayjs.Dayjs,
  teams: TeamDailyTally[]
}

const TeamRanking = () => {
  const { state } = useContext(AppStateContext)
  const { teamId } = useParams()

  const standings = useMemo(() => {
    const team = FindTeam(state.teams, parseInt(teamId ?? ""))
    if (state.teams == undefined || state.seasonSeries == undefined || team == undefined) return

    const runningTallies: TeamDailyTally[] = []

    const dailyTallies: DailyTally[] = []
    const seenGames: number[] = []

    const getEmptyDivisionTally = (): TeamDailyTally[] => {
      const retval: TeamDailyTally[] = []
      state.teams!.forEach((t) => {
        if (t.division?.id == team.division?.id) {
          retval.push({teamId: t.id, gameDifference: 0})
        }
      })
      return retval
    }

    const tallyGame = (date: dayjs.Dayjs, team: Team, isWinner: boolean) => {
      // Init where necessary
      let teamRunningTally = runningTallies.find((t) => t.teamId == team.id)
      if (teamRunningTally == undefined) {
        teamRunningTally = {teamId: team.id, gameDifference: 0}
        runningTallies.push(teamRunningTally)
      }

      let dailyTally = dailyTallies.find((t) => t.date.isSame(date, "day"))
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

    state.seasonSeries
      .flatMap((s) => s.games)

      .sort((a, b) => a.officialDate.localeCompare(b.officialDate))

      .filter((game) => game.gameType == GameType.Regular && game.status.codedGameState == GameStatusCode.Final)

      .filter((game) => {
        if (seenGames.indexOf(game.gamePk) > 0) {
          return false
        }
        seenGames.push(game.gamePk)
        return true
      })

      .filter((game) => {
        const awayTeam = FindTeam(state.teams, game.teams.away.team.id)
        const homeTeam = FindTeam(state.teams, game.teams.home.team.id)

        if (awayTeam == undefined || homeTeam == undefined) return false

        return awayTeam.division?.id == team.division?.id || homeTeam.division?.id == team.division?.id
      })

      // Filter out games that are not regular season games
      // Tally up their records
      .forEach((game) => {
        const awayTeam = FindTeam(state.teams, game.teams.away.team.id)
        const homeTeam = FindTeam(state.teams, game.teams.home.team.id)

        const day = dayjs(game.officialDate)

        // Tally if the away team was in this division
        if (awayTeam!.division?.id == team.division?.id) {
          tallyGame(day, awayTeam!, game.teams.away.isWinner)
        }

        // Tally if the home team was in this division
        if (homeTeam!.division?.id == team.division?.id) {
          tallyGame(day, homeTeam!, game.teams.home.isWinner)
        }
      })

    // Normalize the tallies to have division leader at zero, and the rest of the teams relative to that
    dailyTallies.forEach((dailyTally) => {
      const max = dailyTally.teams.reduce((acc, val) => Math.max(acc, val.gameDifference), 0)

      dailyTally.teams.forEach((team) => {
        team.gameDifference = Math.abs(team.gameDifference - max)
      })
    })

    return dailyTallies
  }, [state.teams, state.seasonSeries, teamId])

  if ((standings?.length ?? 0) <= 0) {
    return
  }

  const getSeries = (): LineSeriesType[] => {
    const ret: LineSeriesType[] = []
    const teams = standings?.[0].teams.map((t) => t.teamId)

    teams?.forEach((teamId) => {
      const team = FindTeam(state.teams, teamId)
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
    <Grid2 display={"flex"} flexDirection={"column"}>
      <TableContainer
        component={Paper}
        elevation={2}
      >
        <Typography
          marginTop={1}
          fontWeight={"bold"}
          textAlign={"center"}
          fontSize={"larger"}
          color={"primary.main"}
        >
          Games Behind
        </Typography>

        <LineChart height={500}
                   margin={{ top: 25, right: 25 }}
                   series={getSeries()}
                   grid={{ horizontal: true, vertical: true}}
                   slotProps={{
                     legend: {
                       hidden: true,
                     }
                   }}
                   yAxis={[
                     {
                       label: 'Games Back',
                       scaleType: 'linear',
                       reverse: true,
                     }
                   ]}
                   xAxis={[{
                     label: 'Day',
                     scaleType: 'band',
                     data: standings?.map((t) => t.date.toISOString()),
                     tickInterval: (date ) => dayjs(date).get("date") == 1,
                     tickLabelInterval: (date) => dayjs(date).get("date") == 1,
                     valueFormatter: (date, context) =>
                       context.location === 'tick'
                         ? dayjs(date).format("MMM")
                         : dayjs(date).format("MMMM DD")
                   }]}/>
      </TableContainer>
    </Grid2>
  )
}

export default TeamRanking
