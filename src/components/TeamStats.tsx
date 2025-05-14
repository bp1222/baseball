import {Box, CircularProgress} from "@mui/material"
import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"

import {DivisionStandings} from "@/components/TeamStats/DivisionStandings.tsx"
import {LeagueStandings} from "@/components/TeamStats/LeagueStandings.tsx"
import {TeamRanking} from "@/components/TeamStats/TeamRanking.tsx"
import {TeamSeriesRecord} from "@/components/TeamStats/TeamSeriesRecord.tsx"
import {getStandings} from "@/services/MlbAPI"
import {useAppStateUtil} from "@/state"
import {Standings} from "@/types/Standings.ts"

const TeamStats = () => {
  const {getTeam} = useAppStateUtil()
  const {seasonId, interestedTeamId} = useParams()

  const [standings, setStandings] = useState<Standings[]>([])

  const team = getTeam(parseInt(interestedTeamId ?? ""))!

  useEffect(() => {
    if (team == undefined) return
    if (seasonId == undefined) return

    getStandings(seasonId, team.league).then((standings) => {
      setStandings(standings)
    })
  }, [team, seasonId])

  return (
    <Box>
      {standings.length == 0 ? (
        <CircularProgress/>
      ) : (
        <>
          <TeamSeriesRecord team={team}/>
          <DivisionStandings team={team} standings={standings}/>
          <LeagueStandings team={team} standings={standings}/>
          <TeamRanking/>
        </>
      )}
    </Box>
  )
}

export default TeamStats