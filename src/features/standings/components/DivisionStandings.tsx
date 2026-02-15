import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material"

import { useDivisions } from "@/queries/division"
import { useTeams } from "@/queries/team"
import LabelPaper from "@/shared/components/LabelPaper"
import { Standings } from "@/types/Standings"
import { Team } from "@/types/Team"

interface StandingsProps {
  team: Team
  standings: Standings[]
}

export const DivisionStandings = ({ team, standings }: StandingsProps) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
  const { data: teams } = useTeams()
  const { getDivision } = useDivisions()
  const division = getDivision(team.division)

  if (division == undefined) return

  const divisionStandings = standings
  .filter((s) => s.division == team?.division)
  .flatMap((s) => s.records)
  .sort((a, b) => a.divisionRank
    ? (parseFloat(a.divisionRank) > parseFloat(b.divisionRank!) ? 1 : -1)
    : (parseFloat(a.leagueRank) > parseFloat(b.leagueRank!) ? 1 : -1))

  const headerCellSx = {
    whiteSpace: "nowrap" as const,
    fontWeight: 700,
    py: 1,
  }

  return (
    <LabelPaper label={`${division.name} Standings`}>
      <TableContainer
        sx={{
          maxHeight: 425,
          overflowX: "auto",
          overflowY: "auto",
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": { borderRadius: 3, bgcolor: "divider" },
          "& thead th": {
            position: "sticky",
            top: 0,
            zIndex: 10,
            // Opaque background so body rows don't show through when scrolling
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.grey[100],
            boxShadow: `0 1px 0 0 ${theme.palette.divider}`,
          },
        }}
      >
        <Table stickyHeader size="small" sx={{ minWidth: 320 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellSx} align="left">Team</TableCell>
              <TableCell sx={headerCellSx} align="right">W</TableCell>
              <TableCell sx={headerCellSx} align="right">L</TableCell>
              <TableCell sx={headerCellSx} align="right">Pct</TableCell>
              <TableCell sx={headerCellSx} align="right">GB</TableCell>
              <TableCell sx={headerCellSx} align="right">E#</TableCell>
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
                    ...(isCurrentTeam && {
                      bgcolor: isDark ? "primary.dark" : "primary.50",
                      color: isDark ? "primary.contrastText" : undefined,
                    }),
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
