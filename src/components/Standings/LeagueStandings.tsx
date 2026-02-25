import { ThemedTable, ThemedTableData } from '@/components/Shared/ThemedTable.tsx'
import { useDivisions } from '@/queries/division'
import { useLeagues } from '@/queries/league'
import { useTeams } from '@/queries/team'
import { DivisionRecord, Standings } from '@/types/Standings'
import { Team } from '@/types/Team'

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

  const allRecords = standings
    .flatMap((s) => s.records)
    .sort((a, b) => parseFloat(a.leagueRank) - parseFloat(b.leagueRank))

  // Division leaders: first-ranked team per division, ordered by their league rank
  const seenDivisions = new Set<number>()
  const divisionLeaders: DivisionRecord[] = []
  const remaining: DivisionRecord[] = []

  for (const record of allRecords) {
    if (record.division != null && !seenDivisions.has(record.division)) {
      seenDivisions.add(record.division)
      divisionLeaders.push(record)
    } else {
      remaining.push(record)
    }
  }

  const orderedStandings = [...divisionLeaders, ...remaining]

  // The league-best team is the first division leader, but only if they've
  // mathematically clinched (the second-place team can't catch them).
  const leaderRecord = orderedStandings[0]
  const secondRecord = orderedStandings[1]
  const leagueBestClinched =
    leaderRecord?.clinched &&
    secondRecord?.leagueGamesBack != null &&
    secondRecord?.gamesPlayed != null &&
    parseFloat(secondRecord.leagueGamesBack) > 162 - secondRecord.gamesPlayed

  const headerRow = ['Team', 'W', 'L', 'Pct', 'WCGB', 'WC-E#']
  const data: ThemedTableData[] = []

  orderedStandings.forEach((record, idx) => {
    const rowTeam = teams?.find((t) => t.id === record.teamId)
    if (!rowTeam) return

    const division = getDivision(rowTeam.division)
    const isDivisionLeader = idx < divisionLeaders.length
    const isLeagueBest = idx === 0 && !!leagueBestClinched

    const divisionPrefix =
      isDivisionLeader && division?.abbreviation
        ? `${division.abbreviation.charAt(division.abbreviation.length - 1)} – `
        : ''

    const clinchIndicator = !record.clinched ? '' : isLeagueBest ? ' – z' : record.divisionChamp ? ' – y' : ' – w'

    data.push({
      id: rowTeam.id,
      data: [
        `${divisionPrefix}${rowTeam.teamName ?? ''}${clinchIndicator}`,
        record.wins,
        record.losses,
        record.winningPercentage,
        record.wildCardGamesBack,
        record.wildCardEliminationNumber,
      ],
    })
  })

  return <ThemedTable label={`${league.name} Standings`} headerRow={headerRow} data={data} highlightRowId={team.id} />
}
