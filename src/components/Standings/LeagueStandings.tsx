import {ThemedTable, ThemedTableData} from "@/components/Shared/ThemedTable.tsx"
import {useDivisions} from '@/queries/division'
import {useLeagues} from '@/queries/league'
import {useTeams} from '@/queries/team'
import {Standings} from '@/types/Standings'
import {Team} from '@/types/Team'

interface LeagueStandingsProps {
  team: Team
  standings: Standings[]
}

export const LeagueStandings = ({ team, standings }: LeagueStandingsProps) => {
  const { data: teams } = useTeams()
  const { getDivision } = useDivisions()
  const { getLeague } = useLeagues()
  const league = getLeague(team.league)

  if (league == undefined) return

  const orderedLeagueStandings = standings
    .flatMap((s) => s.records)
    .sort((a, b) => (parseFloat(a.leagueRank) > parseFloat(b.leagueRank!) ? 1 : -1))

  // League standings always report the top 3 division leaders first.
  const found: number[] = []
  const finalLeagueStandings = orderedLeagueStandings.filter((s) => {
    if (s.division == undefined || found.includes(s.division)) return false
    found.push(s.division)
    return true
  })
  finalLeagueStandings.push(...orderedLeagueStandings.filter((s) => !finalLeagueStandings.includes(s)))

  const headerRow = ['Team', 'W', 'L', 'Pct', 'WCGB', 'WC-E#']
  const data: ThemedTableData[] = []

  finalLeagueStandings.map((s, idx) => {
    const rowTeam = teams?.find((t) => t.id == s.teamId)
    if (!rowTeam) return

    const division = getDivision(rowTeam.division)

    let clinchedLeague = false
    if (idx === 0 && finalLeagueStandings[1]?.leagueGamesBack && finalLeagueStandings[1]?.gamesPlayed) {
      if (parseFloat(finalLeagueStandings[1].leagueGamesBack) > 162 - finalLeagueStandings[1].gamesPlayed) {
        clinchedLeague = true
      }
    }

    const playoffIndicator = s.clinched ? (clinchedLeague ? ' – z' : s.divisionChamp ? ' – y' : ' – w') : null

    data.push({
      id: rowTeam.id,
      data: [
        (idx <= 2 && rowTeam.division && division
        ? `${division.abbreviation?.charAt(division.abbreviation.length - 1) ?? ''} – `
        : '') + (rowTeam.teamName ?? '') + (playoffIndicator ?? ''),
        s.wins,
        s.losses,
        s.winningPercentage,
        s.wildCardGamesBack,
        s.wildCardEliminationNumber,
      ]
    })
  })

  return (
    <ThemedTable label={`${league.name} Standings`} headerRow={headerRow} data={data} highlightRowId={team.id} />
  )
}
