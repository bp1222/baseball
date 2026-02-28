import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

import { useTeams } from '@/queries/team.ts'
import type { Team } from '@/types/Team.ts'

import type { PersonStatsItem, PersonStatSplit } from '../../../../../stats-api/dist'

type SeasonStatsTableProps = {
  statItem: PersonStatsItem
  title: string
  statColumns: { key: string; label: string }[]
}

export const SeasonStatsTable = ({ statItem, title, statColumns }: SeasonStatsTableProps) => {
  const { data: teams } = useTeams()
  const splits = (statItem.splits ?? []).filter((s) => s.team != undefined || s.numTeams == undefined)

  const teamAbbr = (split: PersonStatSplit) => {
    const teamId = split?.team?.id
    if (teamId == null) return '—'
    const full = teams?.find((t: Team) => t.id === teamId)
    return full?.abbreviation ?? (split?.team as { name?: string } | undefined)?.name ?? '—'
  }

  if (splits.length === 0) return null

  return (
    <TableContainer sx={{ mb: 2 }}>
      <Typography
        variant="overline"
        sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 1, mb: 1, display: 'block' }}
      >
        {title}
      </Typography>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Season</TableCell>
            <TableCell>Team</TableCell>
            {statColumns.map(({ key, label }) => (
              <TableCell key={String(key)} align="right">
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {splits.map((split, i) => {
            const stat = split.stat ?? {}
            return (
              <TableRow key={split.season ?? i}>
                <TableCell>{split.season ?? '—'}</TableCell>
                <TableCell>{teamAbbr(split)}</TableCell>
                {statColumns.map(({ key }) => (
                  <TableCell key={String(key)} align="right">
                    {stat[key as string] != null ? String(stat[key as string]) : '—'}
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
