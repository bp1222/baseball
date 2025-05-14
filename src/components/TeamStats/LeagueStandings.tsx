import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,} from "@mui/material"

import {useAppStateUtil} from "@/state"
import {Standings} from "@/types/Standings.ts"
import {Team} from "@/types/Team.ts"
import LabelPaper from "@/utils/LabelPaper.tsx"

interface LeagueStandingsProps {
  team: Team
  standings: Standings[]
}

export const LeagueStandings = ({team, standings}: LeagueStandingsProps) => {
  const {getLeague, getDivision, getTeam} = useAppStateUtil()
  const league = getLeague(team.league)

  if (league == undefined) return

  const orderedLeagueStandings = standings
  .flatMap((s) => s.records)
  .sort((a, b) => parseFloat(a.leagueRank) > parseFloat(b.leagueRank!) ? 1 : -1)

  // League standings always report the top 3 division leaders first.
  const found: number[] = []
  const finalLeagueStandings = orderedLeagueStandings.filter((s) => {
    if (s.division == undefined || found.includes(s.division)) return false
    found.push(s.division)
    return true
  })
  finalLeagueStandings.push(...orderedLeagueStandings.filter((s) => !finalLeagueStandings.includes(s)))

  return (
    <LabelPaper label={league.name + " Standings"}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          maxHeight: 425,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="left">Team</TableCell>
              <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="right">W</TableCell>
              <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="right">L</TableCell>
              <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="right">Pct</TableCell>
              <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="right">WCGB</TableCell>
              <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="right">WC-E#</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {finalLeagueStandings.map((s, idx) => {
              const team = getTeam(s.teamId)
              const division = getDivision(team?.division)

              let clinchedLeague = false
              if (idx == 0 && finalLeagueStandings[1].leagueGamesBack && finalLeagueStandings[1].gamesPlayed) {
                if (parseFloat(finalLeagueStandings[1].leagueGamesBack) > (162 - (finalLeagueStandings[1].gamesPlayed))) {
                  clinchedLeague = true
                }
              }
              const playoffIndicator = s.clinched
                ? (clinchedLeague ? ' - z' : (s.divisionChamp ? ' - y' : ' - w'))
                : null
              return (
                <TableRow key={team?.id}>
                  <TableCell width={1} style={{whiteSpace: 'nowrap'}} align="left">
                    {(idx <= 2 && team?.division
                        ? division?.abbreviation?.charAt(division?.abbreviation?.length - 1) + " - "
                        : ''
                    ) + team?.teamName}{playoffIndicator}
                  </TableCell>
                  <TableCell align="right">{s.wins}</TableCell>
                  <TableCell align="right">{s.losses}</TableCell>
                  <TableCell align="right">{s.winningPercentage}</TableCell>
                  <TableCell align="right">{s.wildCardGamesBack}</TableCell>
                  <TableCell align="right">{s.wildCardEliminationNumber}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </LabelPaper>
  )
}
