import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from '@mui/material'
import type { ModelRecord } from '@bp1222/stats-api'
import { clinchSeriesLabel } from '../lib/clinch'
import { TeamLogo } from './TeamLogo'

type StandingsTableProps = {
  title: string
  records: ModelRecord[]
  highlightTeamId: number
  gamesBackField?: 'gamesBack' | 'leagueGamesBack' | 'divisionGamesBack'
}

export function StandingsTable({
  title,
  records,
  highlightTeamId,
  gamesBackField = 'gamesBack',
}: StandingsTableProps) {
  if (records.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography color="text.secondary">Standings unavailable.</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Team</TableCell>
              <TableCell align="right">W</TableCell>
              <TableCell align="right">L</TableCell>
              <TableCell align="right">PCT</TableCell>
              <TableCell align="right">GB</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((row) => {
              const highlighted = row.team.id === highlightTeamId
              const gb =
                gamesBackField === 'leagueGamesBack'
                  ? (row.leagueGamesBack ?? row.gamesBack)
                  : gamesBackField === 'divisionGamesBack'
                    ? (row.divisionGamesBack ?? row.gamesBack)
                    : row.gamesBack
              return (
                <TableRow
                  key={row.team.id}
                  selected={highlighted}
                  sx={{
                    bgcolor: highlighted ? 'rgba(11, 61, 46, 0.08)' : undefined,
                    '& td': { fontWeight: highlighted ? 700 : 400 },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                      <TeamLogo teamId={row.team.id} alt={row.team.name} size={22} />
                      <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
                        {clinchSeriesLabel(
                          row.team.abbreviation ?? row.team.name,
                          row.clinchIndicator,
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{row.leagueRecord.wins}</TableCell>
                  <TableCell align="right">{row.leagueRecord.losses}</TableCell>
                  <TableCell align="right">{row.leagueRecord.pct}</TableCell>
                  <TableCell align="right">{gb || '-'}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
