import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Fragment, useMemo } from 'react'
import type { RosterEntry } from '@bp1222/stats-api'
import { useSeason, useTeamRoster } from '../api/queries'
import { playerHeadshotUrl } from '../lib/headshots'
import { localToday } from '../lib/series'
import { QueryState } from './QueryState'

type TeamRosterProps = {
  year: string
  teamId: number
  onPlayerClick: (personId: number) => void
}

const POSITION_GROUP_ORDER = [
  'Pitcher',
  'Catcher',
  'Infielder',
  'Outfielder',
  'Hitter',
] as const

/** Shared column template so every section aligns. */
const COLS = {
  photo: '40px',
  jersey: '40px',
  player: 'auto',
  pos: '44px',
  status: '34%',
} as const

const cell = { px: 1, py: 0.55, fontSize: '0.8125rem' } as const
const headCell = {
  ...cell,
  py: 0.7,
  fontSize: '0.72rem',
  fontWeight: 700,
  color: 'text.secondary',
} as const

function jerseySortKey(jersey: string | undefined): number {
  if (jersey == null || jersey === '') return Number.POSITIVE_INFINITY
  const n = Number.parseInt(jersey, 10)
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
}

function groupLabel(type: string): string {
  switch (type) {
    case 'Pitcher':
      return 'Pitchers'
    case 'Catcher':
      return 'Catchers'
    case 'Infielder':
      return 'Infielders'
    case 'Outfielder':
      return 'Outfielders'
    case 'Hitter':
      return 'Designated hitters'
    default:
      return type
  }
}

function formatStatus(entry: RosterEntry): string {
  const code = entry.status?.code
  const description = entry.status?.description
  if (code === 'A') return 'Active'
  if (code != null && /^D\d/.test(code)) {
    return description?.replace(/^Injured\s+/i, 'IL ') ?? `IL ${code.slice(1)}`
  }
  if (code === 'RM') return description ?? 'Rehab'
  return description ?? '—'
}

function groupRoster(entries: RosterEntry[]): { type: string; players: RosterEntry[] }[] {
  const byType = new Map<string, RosterEntry[]>()

  for (const entry of entries) {
    const type = entry.position?.type?.trim() || 'Other'
    const list = byType.get(type)
    if (list) list.push(entry)
    else byType.set(type, [entry])
  }

  for (const list of byType.values()) {
    list.sort((a, b) => {
      const jerseyCmp = jerseySortKey(a.jerseyNumber) - jerseySortKey(b.jerseyNumber)
      if (jerseyCmp !== 0) return jerseyCmp
      return (a.person?.fullName ?? '').localeCompare(b.person?.fullName ?? '')
    })
  }

  const ordered: { type: string; players: RosterEntry[] }[] = []
  const seen = new Set<string>()

  for (const type of POSITION_GROUP_ORDER) {
    const players = byType.get(type)
    if (players && players.length > 0) {
      ordered.push({ type, players })
      seen.add(type)
    }
  }

  for (const [type, players] of [...byType.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    if (seen.has(type) || players.length === 0) continue
    ordered.push({ type, players })
  }

  return ordered
}

function rosterAsOfDate(year: string, seasonEnd: string | undefined): string | undefined {
  const today = localToday()
  const end = seasonEnd ?? `${year}-10-01`
  if (end > today) return today
  return end
}

function ColGroup() {
  return (
    <colgroup>
      <col style={{ width: COLS.photo }} />
      <col style={{ width: COLS.jersey }} />
      <col style={{ width: COLS.player }} />
      <col style={{ width: COLS.pos }} />
      <col style={{ width: COLS.status }} />
    </colgroup>
  )
}

export function TeamRoster({ year, teamId, onPlayerClick }: TeamRosterProps) {
  const seasonQuery = useSeason(year)
  const asOf = rosterAsOfDate(year, seasonQuery.data?.regularSeasonEndDate)
  const rosterQuery = useTeamRoster(year, teamId, asOf)

  const groups = useMemo(() => groupRoster(rosterQuery.data ?? []), [rosterQuery.data])

  const isLoading = seasonQuery.isLoading || rosterQuery.isLoading
  const isError = seasonQuery.isError || rosterQuery.isError
  const error = seasonQuery.error ?? rosterQuery.error

  return (
    <QueryState
      isLoading={isLoading || asOf == null}
      isError={isError}
      error={error}
      isEmpty={!isLoading && groups.length === 0}
      emptyMessage="No roster found for this season."
    >
      <Paper
        variant="outlined"
        sx={{
          overflow: 'hidden',
          bgcolor: 'background.paper',
          maxWidth: 600,
          mt: 3,
        }}
      >
        <TableContainer>
          <Table
            size="small"
            aria-label="Team roster"
            sx={{ tableLayout: 'fixed', width: '100%' }}
          >
            <ColGroup />
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headCell, pl: 1.25 }} />
                <TableCell sx={headCell}>#</TableCell>
                <TableCell sx={headCell}>Player</TableCell>
                <TableCell sx={headCell}>Pos</TableCell>
                <TableCell sx={{ ...headCell, pr: 1.5 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map(({ type, players }) => (
                <Fragment key={type}>
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      sx={{
                        px: 1.25,
                        py: 0.85,
                        bgcolor: 'action.hover',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, letterSpacing: '0.01em' }}
                      >
                        {groupLabel(type)}
                        <Box
                          component="span"
                          sx={{ ml: 1, color: 'text.secondary', fontWeight: 500 }}
                        >
                          {players.length}
                        </Box>
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {players.map((entry) => {
                    const person = entry.person
                    if (person == null) return null
                    const id = person.id
                    return (
                      <TableRow
                        key={id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => onPlayerClick(id)}
                      >
                        <TableCell sx={{ ...cell, pl: 1.25 }}>
                          <Box
                            component="img"
                            src={playerHeadshotUrl(id)}
                            alt=""
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              display: 'block',
                              objectFit: 'cover',
                              bgcolor: 'action.selected',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ ...cell, fontVariantNumeric: 'tabular-nums' }}>
                          {entry.jerseyNumber || '—'}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cell,
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {person.fullName}
                        </TableCell>
                        <TableCell sx={cell}>
                          {entry.position?.abbreviation ?? '—'}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cell,
                            pr: 1.5,
                            color: 'text.secondary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatStatus(entry)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </QueryState>
  )
}
