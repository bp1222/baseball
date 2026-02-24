import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import dayjs from 'dayjs'

import type { PersonGameLogGroup } from '@/queries/person'
import { useTeams } from '@/queries/team'
import type { GameLogSplit } from '@/types/GameLogSplit'
import type { Team } from '@/types/Team'

const HITTING_GAME_LOG_COLUMNS = [
  { key: 'atBats', label: 'AB' },
  { key: 'runs', label: 'R' },
  { key: 'hits', label: 'H' },
  { key: 'rbi', label: 'RBI' },
  { key: 'baseOnBalls', label: 'BB' },
  { key: 'strikeOuts', label: 'SO' },
]

const PITCHING_GAME_LOG_COLUMNS = [
  { key: 'inningsPitched', label: 'IP' },
  { key: 'earnedRuns', label: 'ER' },
  { key: 'strikeOuts', label: 'SO' },
  { key: 'baseOnBalls', label: 'BB' },
  { key: 'hits', label: 'H' },
]

type GameLogTableProps = {
  title: string
  splits: GameLogSplit[]
  group: PersonGameLogGroup
}

export const GameLogTable = ({ title, splits, group }: GameLogTableProps) => {
  const { data: teams } = useTeams()
  const columns = group === 'hitting' ? HITTING_GAME_LOG_COLUMNS : PITCHING_GAME_LOG_COLUMNS

  const oppAbbr = (split: GameLogSplit) => {
    const opp = split.opponent
    if (!opp) return '—'
    if (opp.abbreviation) return opp.abbreviation
    const byId = teams?.find((t: Team) => t.id === opp.id)
    return byId?.abbreviation ?? opp.name ?? '—'
  }

  const formatDate = (dateStr?: string) => (dateStr ? dayjs(dateStr).format('M/D/YY') : '—')

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
            <TableCell>Date</TableCell>
            <TableCell>Opp</TableCell>
            {columns.map(({ label }) => (
              <TableCell key={label} align="right">
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {splits.map((split, i) => {
            const stat = split.stat ?? {}
            return (
              <TableRow key={split.date ?? split.game?.gamePk ?? i}>
                <TableCell>{formatDate(split.date)}</TableCell>
                <TableCell>
                  {split.isHome != null ? (split.isHome ? '' : '@') : ''}
                  {oppAbbr(split)}
                </TableCell>
                {columns.map(({ key }) => (
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
