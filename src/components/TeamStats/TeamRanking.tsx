import {Grid, Paper, TableContainer, Typography} from "@mui/material"
import {LineChart, LineSeriesType} from "@mui/x-charts"
import dayjs from "dayjs"
import {useMemo} from "react"
import {useParams} from "react-router-dom"

import {GetTeamTheme} from "@/colors"
import {useAppState, useAppStateUtil} from "@/state"
import {GameStatus} from "@/types/Game/GameStatus.ts"
import {GameType} from "@/types/Game/GameType.ts"
import {Team} from "@/types/Team.ts"

type TeamDailyTally = {
  teamId: number,
  gameDifference: number
}

type DailyTally = {
  date: dayjs.Dayjs,
  teams: TeamDailyTally[]
}

export const TeamRanking = () => {
  const {teams, seasonSeries} = useAppState()
  const {getTeam} = useAppStateUtil()
  const {interestedTeamId} = useParams()

  const standings = useMemo(() => {
    const team = getTeam(parseInt(interestedTeamId ?? ""))
    if (teams == undefined || seasonSeries == undefined || team == undefined) return

    const runningTallies: TeamDailyTally[] = []

    const dailyTallies: DailyTally[] = []
    const seenGames: number[] = []

    const getEmptyDivisionTally = (): TeamDailyTally[] => {
      const retval: TeamDailyTally[] = []
      teams.forEach((t) => {
        if (t.division == team.division) {
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

    seasonSeries
    .flatMap((s) => s.games)
    .sort((a, b) => a.gameDate.diff(b.gameDate, "minute"))
    .filter((game) => game.gameType == GameType.Regular && game.gameStatus == GameStatus.Final)
    .filter((game) => {
      if (seenGames.indexOf(game.pk) > 0) {
        return false
      }
      seenGames.push(game.pk)
      return true
    })

    .filter((game) => {
      const awayTeam = getTeam(game.away.teamId)
      const homeTeam = getTeam(game.home.teamId)
      if (awayTeam == undefined || homeTeam == undefined) return false
      return awayTeam.division == team.division || homeTeam.division == team.division
    })

    // Filter out games that are not regular season games
    // Tally up their records
    .forEach((game) => {
      const awayTeam = getTeam(game.away.teamId)
      const homeTeam = getTeam(game.home.teamId)

      // Tally if the away team was in this division
      if (awayTeam!.division == team.division) {
        tallyGame(game.gameDate, awayTeam!, game.away.isWinner)
      }

      // Tally if the home team was in this division
      if (homeTeam!.division == team.division) {
        tallyGame(game.gameDate, homeTeam!, game.home.isWinner)
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
  }, [teams, seasonSeries, interestedTeamId, getTeam])

  if ((standings?.length ?? 0) <= 0) {
    return
  }

  const getSeries = (): LineSeriesType[] => {
    const ret: LineSeriesType[] = []
    const teams = standings?.[0].teams.map((t) => t.teamId)

    teams?.forEach((teamId) => {
      const team = getTeam(teamId)
      ret.push({
        type: 'line',
        data: standings?.map((t) => t.teams.filter((team) => team.teamId == teamId).map((team) => team.gameDifference)[0]),
        label: team?.name,
        showMark: false,
        curve: 'catmullRom',
        color: GetTeamTheme(team?.id ?? 0).palette.primary.main,
      })
    })
    return ret
  }

  return (
    <Grid display={"flex"} flexDirection={"column"}>
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
                   series={getSeries()}
                   grid={{horizontal: true}}
                   yAxis={[
                     {
                       label: 'Games Back',
                       scaleType: 'linear',
                       reverse: true,
                     }
                   ]}
                   xAxis={[
                     {
                       label: 'Day',
                       scaleType: 'band',
                       data: standings?.map((t) => t.date),
                       tickInterval: (date) => date?.get("date") == 1,
                       tickLabelInterval: (date) => date?.get("date") == 1,
                       valueFormatter: (date, context) =>
                         context.location === 'tick'
                           ? date.format("MMM")
                           : date.format("MMMM DD")
                     }
                   ]}

        />
      </TableContainer>
    </Grid>
  )
}