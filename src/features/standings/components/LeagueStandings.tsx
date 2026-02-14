import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"

import { useDivisions } from "@/queries/division"
import { useLeagues } from "@/queries/league"
import { useTeams } from "@/queries/team"
import { Standings } from "@/types/Standings"
import { Team } from "@/types/Team"
import LabelPaper from "@/shared/components/LabelPaper"

interface LeagueStandingsProps {
  team: Team
  standings: Standings[]
}

export const LeagueStandings = ({team, standings}: LeagueStandingsProps) => {
  const { data: teams } = useTeams()
  const { getDivision } = useDivisions()
  const { getLeague } = useLeagues()
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

  const headerCellSx = { whiteSpace: "nowrap" as const, fontWeight: 700, bgcolor: "grey.100", py: 1 }

  return (
    <LabelPaper label={`${league.name} Standings`}>
      <TableContainer
        sx={{
          maxHeight: 425,
          overflowX: "auto",
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": { borderRadius: 3, bgcolor: "grey.400" },
        }}
      >
        <Table stickyHeader size="small" sx={{ minWidth: 320 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerCellSx }} align="left">Team</TableCell>
              <TableCell sx={{ ...headerCellSx }} align="right">W</TableCell>
              <TableCell sx={{ ...headerCellSx }} align="right">L</TableCell>
              <TableCell sx={{ ...headerCellSx }} align="right">Pct</TableCell>
              <TableCell sx={{ ...headerCellSx }} align="right">WCGB</TableCell>
              <TableCell sx={{ ...headerCellSx }} align="right">WC-E#</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {finalLeagueStandings.map((s, idx) => {
              const rowTeam = teams?.find((t) => t.id == s.teamId)
              const division = getDivision(rowTeam?.division)

              let clinchedLeague = false
              if (idx === 0 && finalLeagueStandings[1]?.leagueGamesBack && finalLeagueStandings[1]?.gamesPlayed) {
                if (parseFloat(finalLeagueStandings[1].leagueGamesBack) > (162 - (finalLeagueStandings[1].gamesPlayed))) {
                  clinchedLeague = true
                }
              }
              const playoffIndicator = s.clinched
                ? (clinchedLeague ? " – z" : (s.divisionChamp ? " – y" : " – w"))
                : null
              const isCurrentTeam = s.teamId === team.id
              return (
                <TableRow
                  key={rowTeam?.id}
                  sx={{
                    "&:hover": { bgcolor: isCurrentTeam ? "primary.light" : "action.hover" },
                    ...(isCurrentTeam && { bgcolor: "primary.50" }),
                  }}
                >
                  <TableCell sx={{ whiteSpace: "nowrap", fontWeight: isCurrentTeam ? 600 : 400 }} align="left">
                    {(idx <= 2 && rowTeam?.division && division
                      ? `${division.abbreviation?.charAt(division.abbreviation.length - 1) ?? ""} – `
                      : ""
                    )}{rowTeam?.teamName}{playoffIndicator}
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
