import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"

import { useDivisions } from "@/queries/division"
import { useTeams } from "@/queries/team"
import { Standings } from "@/types/Standings"
import { Team } from "@/types/Team"
import LabelPaper from "@/shared/components/LabelPaper"

interface StandingsProps {
  team: Team
  standings: Standings[]
}

export const DivisionStandings = ({team, standings}: StandingsProps) => {
  const { data: teams } = useTeams()
  const { getDivision }  = useDivisions()
  const division = getDivision(team.division)

  if (division == undefined) return

  const divisionStandings = standings
  .filter((s) => s.division == team?.division)
  .flatMap((s) => s.records)
  .sort((a, b) => a.divisionRank
    ? (parseFloat(a.divisionRank) > parseFloat(b.divisionRank!) ? 1 : -1)
    : (parseFloat(a.leagueRank) > parseFloat(b.leagueRank!) ? 1 : -1))

  return (
    <LabelPaper label={`${division.name} Standings`}>
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
              <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 700, bgcolor: "grey.100", py: 1 }} align="left">
                Team
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 700, bgcolor: "grey.100", py: 1 }} align="right">
                W
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 700, bgcolor: "grey.100", py: 1 }} align="right">
                L
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 700, bgcolor: "grey.100", py: 1 }} align="right">
                Pct
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 700, bgcolor: "grey.100", py: 1 }} align="right">
                GB
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 700, bgcolor: "grey.100", py: 1 }} align="right">
                E#
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {divisionStandings.map((d) => {
              const rowTeam = teams?.find((t) => t.id == d.teamId)
              const isCurrentTeam = d.teamId === team.id
              return (
                <TableRow
                  key={d.teamId}
                  sx={{
                    "&:hover": { bgcolor: isCurrentTeam ? "primary.light" : "action.hover" },
                    ...(isCurrentTeam && { bgcolor: "primary.50" }),
                  }}
                >
                  <TableCell sx={{ whiteSpace: "nowrap", fontWeight: isCurrentTeam ? 600 : 400 }} align="left">
                    {rowTeam?.teamName}
                  </TableCell>
                  <TableCell align="right">{d.wins}</TableCell>
                  <TableCell align="right">{d.losses}</TableCell>
                  <TableCell align="right">{d.winningPercentage}</TableCell>
                  <TableCell align="right">{d.gamesBack}</TableCell>
                  <TableCell align="right">{d.eliminationNumber}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </LabelPaper>
  )
}
