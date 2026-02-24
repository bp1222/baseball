import {ThemedTable, ThemedTableData} from '@/components/Shared/ThemedTable.tsx'
import {useDivisions} from '@/queries/division'
import {useTeams} from '@/queries/team'
import {Standings} from '@/types/Standings'
import {Team} from '@/types/Team'

interface DivisionStandingsProps {
  team: Team
  standings: Standings[]
}

export const DivisionStandings = ({ team, standings }: DivisionStandingsProps) => {
  const { data: teams } = useTeams()
  const { getDivision } = useDivisions()
  const division = getDivision(team.division)

  if (division == undefined) return

  const divisionStandings = standings
    .filter((s) => s.division === team.division)
    .flatMap((s) => s.records)
    .sort((a, b) => {
      if (a.divisionRank && b.divisionRank) {
        return parseFloat(a.divisionRank) - parseFloat(b.divisionRank)
      }
      return parseFloat(a.leagueRank) - parseFloat(b.leagueRank)
    })

  const headerRow = ['Team', 'W', 'L', 'Pct', 'GB', 'E#']
  const data: ThemedTableData[] = []

  divisionStandings.forEach((record) => {
    const rowTeam = teams?.find((t) => t.id === record.teamId)
    if (!rowTeam) return

    data.push({
      id: rowTeam.id,
      data: [
        rowTeam.teamName ?? '',
        record.wins,
        record.losses,
        record.winningPercentage,
        record.gamesBack,
        record.eliminationNumber,
      ],
    })
  })

  return (
    <ThemedTable label={`${division.name} Standings`} headerRow={headerRow} data={data} highlightRowId={team.id} />
  )
}
