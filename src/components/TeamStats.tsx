import {DivisionStandings, MlbApi} from "@bp1222/stats-api"
import {Box} from "@mui/material"
import {useContext, useEffect, useState} from "react"
import {useParams} from "react-router-dom"

import {AppStateContext} from "@/state/context.ts"
import {GetTeam} from "@/utils/GetTeam.ts"

import {Standings} from "./TeamStats/Standings.tsx"
import {TeamRanking} from "./TeamStats/TeamRanking.tsx"
import {TeamSeriesRecord} from "./TeamStats/TeamSeriesRecord.tsx"

const api = new MlbApi()

const TeamStats = () => {
  const {state} = useContext(AppStateContext)
  const [standings, setStandings] = useState<DivisionStandings[]>([])
  const {seasonId, teamId} = useParams()

  const team = GetTeam(state.teams, parseInt(teamId ?? ""))

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

  const divisionStandings = standings
  .filter((s) => s.division?.id == team?.division?.id)
  .flatMap((s) => s.teamRecords)
  .sort((a, b) => a.divisionRank
    ? (parseFloat(a.divisionRank) > parseFloat(b.divisionRank!) ? 1 : -1)
    : (parseFloat(a.leagueRank) > parseFloat(b.leagueRank!) ? 1 : -1))

  const preLeagueStandings = standings
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
  const found: number[] = []
  const finalLeagueStandings= preLeagueStandings.filter((s) => {
    if (found.includes(s.team.division!.id)) return false
    found.push(s.team.division!.id)
    return true
  })
  finalLeagueStandings.push(...preLeagueStandings.filter((s) => !finalLeagueStandings.includes(s)))

  return (
    <Box>
      <TeamSeriesRecord team={team!}/>
      {team?.division != undefined ? <Standings standings={divisionStandings} league={false}
                                                divisionName={team.division.name ?? "Division"}/> : <></>}
      <Standings standings={finalLeagueStandings} league={true} leagueName={team?.league?.name ?? "League"}/>
      <TeamRanking/>
    </Box>
  )
}

export default TeamStats