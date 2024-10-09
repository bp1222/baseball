import {DivisionStandings,MlbApi} from "@bp1222/stats-api"
import {Box} from "@mui/material"
import {useContext, useEffect, useState} from "react"
import { useParams } from "react-router-dom"

import {AppStateContext} from "../../state/Context.tsx"
import {FindTeam} from "../../utils/FindTeam.ts"
import Standings from "../Standings.tsx"
import TeamRanking from "./TeamRanking.tsx"
import TeamSeriesRecord from "./TeamSeriesRecord.tsx"

const api = new MlbApi()

const TeamStats = () => {
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
    .sort((a, b) => a.divisionRank
    ? (parseFloat(a.divisionRank) > parseFloat(b.divisionRank!) ? 1 : -1)
    : (parseFloat(a.leagueRank) > parseFloat(b.leagueRank!) ? 1 : -1))

  // Data for League Standings if they're in the same league
  const leagueStandings = standings
    .filter((s) => s.league?.id == team?.league?.id)
    .flatMap((s) => s.teamRecords)
    .sort((a, b) => {
      if (a.divisionChamp && b.divisionChamp) {
        return parseFloat(a.leagueRank) > parseFloat(b.leagueRank!) ? 1 : -1
      }

      if (a.divisionChamp && !b.divisionChamp) return -1
      if (!a.divisionChamp && b.divisionChamp) return 1

      if (a.clinched && !b.clinched) return -1
      if (!a.clinched && b.clinched) return 1

      return parseFloat(a.leagueRank) > parseFloat(b.leagueRank!) ? 1 : -1
    })

  return (
    <Box>
      <TeamSeriesRecord team={team!} />
      {team?.division != undefined ? <Standings standings={divisionStandings} league={false} divisionName={team.division.name ?? "Division"} /> : <></>}
      <Standings standings={leagueStandings} league={true} leagueName={team?.league?.name ?? "League"}/>
      <TeamRanking />
    </Box>
  )
}

export default TeamStats