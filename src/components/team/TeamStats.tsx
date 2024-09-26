import {CircularProgress, Paper, Stack, TableContainer, Typography} from "@mui/material"
import {lazy, Suspense, useContext, useEffect, useState} from "react"
import { AppStateContext } from "../../state/Context.tsx"
import { MlbApi, TeamRecord, DivisionStandings } from "@bp1222/stats-api"
import { useParams } from "react-router-dom"

import Standings from "../Standings.tsx"
import {FindTeam} from "../../utils/findTeam.ts";

const TeamRanking = lazy(() => import("./TeamRanking.tsx"))

const TeamStats = () => {
  const api = new MlbApi()

  const { state } = useContext(AppStateContext)
  const [standings, setStandings] = useState<DivisionStandings[]>([])
  const { seasonId, teamId } = useParams()

  const team = FindTeam(state.teams, parseInt(teamId ?? ""))

  useEffect(() => {
    if (team == undefined) return
    if (seasonId == undefined) return

    api.getStandings({
      leagueId: team.league!.id!,
      season: seasonId,
      hydrate: "team(division)"
    }).then((standings) => {
      if (standings.records == undefined) return
      setStandings(standings.records)
    })
  }, [team, seasonId])

  // Data for Division Standings
  const divisionStandings = standings.find((s) => s.division?.id == team?.division?.id)?.teamRecords

  // Data for League Standings
  const leagueStandings: TeamRecord[] = []
  // Get the top three
  standings.forEach((s) => leagueStandings.push(s.teamRecords[0]))
  leagueStandings.sort((a, b) => parseFloat(a.winningPercentage!) > parseFloat(b.winningPercentage!) ? -1 : 1)
  // Get the next three
  const leagueStandingWildCard: TeamRecord[] = []
  standings.forEach((s) => s.teamRecords.forEach((tr) => {
    if (tr.wildCardGamesBack! === '-' || tr.wildCardGamesBack?.startsWith('+')) {
      if (leagueStandings.find((s) => s.team.id == tr.team.id)) return
      leagueStandingWildCard.push(tr)
    }
  }))
  leagueStandingWildCard.sort((a, b) => parseFloat(a.winningPercentage!) > parseFloat(b.winningPercentage!) ? -1 : 1)

  // For some reason, the 2023 AL Wildcard race lists the mariners as no games back?  wtf?  So only take top 3
  leagueStandings.push(...leagueStandingWildCard.slice(0,3))

  return (
      <Stack width={1} height={1} direction={"column"}>
        <Stack direction={{ xs: "column", sm: "row" }}>
          <TableContainer
              component={Paper}
              elevation={2}
              sx={{
                width: { xs: "100%", sm: "49.5%" }
              }}
          >
            <Typography
                marginTop={1}
                fontWeight={"bold"}
                textAlign={"center"}
                fontSize={"larger"}
                color={"primary.main"}
            >
              Division Standings
            </Typography>
            <Standings standings={divisionStandings} league={false} />
          </TableContainer>
          <TableContainer
              component={Paper}
              elevation={2}
              sx={{
                width: { xs: "100%", sm: "49.5%" },
                marginLeft: { xs: 0, sm: "1%" },
              }}
          >
            <Typography
                marginTop={1}
                fontWeight={"bold"}
                textAlign={"center"}
                fontSize={"larger"}
                color={"primary.main"}
            >
              League Standings
            </Typography>
            <Standings standings={leagueStandings} league={true} />
          </TableContainer>
        </Stack>

        <TableContainer
            component={Paper}
            elevation={2}
            sx={{
              marginTop: 3,
            }}
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
          <Suspense fallback={<Stack justifyContent={"center"}><CircularProgress /></Stack>}>
            <TeamRanking />
          </Suspense>
        </TableContainer>
      </Stack>
  )
}

export default TeamStats