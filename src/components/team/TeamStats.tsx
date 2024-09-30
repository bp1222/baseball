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

  const divisionStandings = standings
    .filter((s) => s.division?.id == team?.division?.id)
    .flatMap((s) => s.teamRecords)
    .sort((a, b) => parseFloat(a.divisionRank) > parseFloat(b.divisionRank!) ? 1 : -1)

  // Data for League Standings if they're in the same league
  const leagueStandings: TeamRecord[] = standings
    .filter((s) => s.league?.id == team?.league?.id)
    .flatMap((s) => s.teamRecords)
    .sort((a, b) => {
      if (a.divisionChamp && b.divisionChamp) {
        return parseFloat(a.leagueRank) > parseFloat(b.leagueRank!) ? 1 : -1
      }
      if (a.divisionChamp && !b.divisionChamp) return -1
      if (!a.divisionChamp && b.divisionChamp) return 1
      return parseFloat(a.leagueRank) > parseFloat(b.leagueRank!) ? 1 : -1
    })

  return (
      <Stack width={1} height={1} direction={"column"}>
        <Stack direction={{ xs: "column", sm: "row" }}>
          <Standings standings={divisionStandings} league={false} />
          <Standings standings={leagueStandings} league={true} />
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