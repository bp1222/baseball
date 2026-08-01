import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import {
  defaultStatGroup,
  pickDefaultSeason,
  usePersonCareer,
  usePersonGameLog,
  type PlayerStatGroup,
} from '../api/playerDetail'
import { useSeasonTeams } from '../api/queries'
import { playerHeadshotUrl } from '../lib/headshots'
import { formatMonthDay } from '../lib/series'
import { TeamLogo } from './TeamLogo'

type PlayerDetailModalProps = {
  personId: number | null
  open: boolean
  onClose: () => void
  defaultSeason?: string | null
}

const cell = { px: 0.6, py: 0.4, fontSize: '0.75rem' } as const
const headCell = {
  ...cell,
  py: 0.6,
  fontSize: '0.72rem',
  fontWeight: 700,
} as const
const firstCell = { ...cell, pl: 1.25 } as const
const firstHead = { ...headCell, pl: 1.25 } as const
const lastStatCell = { ...cell, pr: 1.25 } as const
const lastStatHead = { ...headCell, pr: 1.25 } as const
const EMPTY_SEASONS: string[] = []

/** Contiguous columns — no spacer gutter. */
const hitCol = {
  date: '13%',
  tm: '9%',
  opp: '20%',
  wl: '7%',
  stat: '7.3%',
} as const

const pitchCol = {
  date: '12%',
  tm: '8%',
  opp: '18%',
  wl: '7%',
  ip: '8%',
  stat: '7%',
  dec: '8%',
} as const

function formatStat(value: unknown, fallback = '—'): string {
  if (value == null || value === '') return fallback
  return String(value)
}

export function PlayerDetailModal({
  personId,
  open,
  onClose,
  defaultSeason,
}: PlayerDetailModalProps) {
  const careerQuery = usePersonCareer(personId, open)
  const bundle = careerQuery.data

  const [group, setGroup] = useState<PlayerStatGroup>('hitting')
  const [season, setSeason] = useState<string | null>(null)
  const [groupReady, setGroupReady] = useState(false)

  useEffect(() => {
    if (!open) {
      setGroupReady(false)
      setSeason(null)
      return
    }
    setGroupReady(false)
    setSeason(null)
  }, [open, personId])

  useEffect(() => {
    if (!bundle || groupReady) return
    const next = defaultStatGroup(bundle.person, bundle.hasHitting, bundle.hasPitching)
    setGroup(next)
    setSeason(pickDefaultSeason(bundle.seasonsByGroup[next], defaultSeason))
    setGroupReady(true)
  }, [bundle, groupReady, defaultSeason])

  const seasons = bundle?.seasonsByGroup[group] ?? EMPTY_SEASONS

  useEffect(() => {
    if (!groupReady || !bundle) return
    const list = bundle.seasonsByGroup[group]
    if (season && list.includes(season)) return
    setSeason(pickDefaultSeason(list, defaultSeason))
  }, [group, season, groupReady, bundle, defaultSeason])

  const gameLogQuery = usePersonGameLog(
    personId,
    season,
    group,
    open && groupReady && Boolean(season),
  )
  const teamsQuery = useSeasonTeams(season ?? '')
  const teamAbbrById = new Map<number, string>()
  const teamNameById = new Map<number, string>()
  for (const team of teamsQuery.data ?? []) {
    if (team.abbreviation) teamAbbrById.set(team.id, team.abbreviation)
    if (team.name) teamNameById.set(team.id, team.name)
  }

  const person = bundle?.person
  const careerStat = bundle?.careerByGroup[group]?.stat
  const showGroupToggle = Boolean(bundle?.hasHitting && bundle?.hasPitching)
  const seasonTeamIds =
    season != null ? (bundle?.teamsBySeasonByGroup[group][season] ?? []) : []

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      aria-labelledby="player-detail-title"
    >
      <DialogTitle
        id="player-detail-title"
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 1,
          pr: 1,
        }}
      >
        <Typography variant="h6" component="div" sx={{ lineHeight: 1.2, pt: 0.25 }}>
          {person?.fullName ?? 'Player'}
        </Typography>
        <IconButton aria-label="Close" onClick={onClose} size="small">
          ×
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {careerQuery.isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {careerQuery.isError && (
          <Typography color="error" sx={{ py: 2 }}>
            Couldn’t load player details. Try again in a moment.
          </Typography>
        )}

        {careerQuery.isSuccess && person && bundle && (
          <Stack spacing={2.5}>
            <PlayerHeader
              person={person}
              group={group}
              careerStat={careerStat}
              seasonTeamIds={seasonTeamIds}
              teamNameById={teamNameById}
            />

            {(showGroupToggle || seasons.length > 0) && (
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                {showGroupToggle ? (
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={group}
                    onChange={(_, v: PlayerStatGroup | null) => {
                      if (v) setGroup(v)
                    }}
                  >
                    <ToggleButton value="hitting">Hitting</ToggleButton>
                    <ToggleButton value="pitching">Pitching</ToggleButton>
                  </ToggleButtonGroup>
                ) : (
                  <Typography variant="subtitle2" color="text.secondary">
                    {group === 'hitting' ? 'Hitting' : 'Pitching'} game log
                  </Typography>
                )}

                {seasons.length > 0 && (
                  <FormControl size="small" sx={{ minWidth: 110 }}>
                    <Select
                      value={season ?? ''}
                      displayEmpty
                      onChange={(e) => setSeason(String(e.target.value))}
                      inputProps={{ 'aria-label': 'Season' }}
                    >
                      {seasons.map((y) => (
                        <MenuItem key={y} value={y}>
                          {y}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Stack>
            )}

            {!season ? (
              <Typography color="text.secondary" variant="body2">
                No season game log available.
              </Typography>
            ) : gameLogQuery.isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={28} />
              </Box>
            ) : gameLogQuery.isError ? (
              <Typography color="error" variant="body2">
                Couldn’t load game log.
              </Typography>
            ) : (
              <GameLogTable
                group={group}
                splits={gameLogQuery.data ?? []}
                teamAbbrById={teamAbbrById}
              />
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  )
}

function PlayerHeader({
  person,
  group,
  careerStat,
  seasonTeamIds,
  teamNameById,
}: {
  person: NonNullable<ReturnType<typeof usePersonCareer>['data']>['person']
  group: PlayerStatGroup
  careerStat?: Record<string, unknown>
  seasonTeamIds: number[]
  teamNameById: Map<number, string>
}) {
  const currentTeam = person.currentTeam
  const pos = person.primaryPosition?.abbreviation
  const number = person.primaryNumber
  const bats = person.batSide?.code
  const throws = person.pitchHand?.code

  const metaBits = [
    pos,
    number ? `#${number}` : null,
    bats || throws ? `B/T: ${bats ?? '—'}/${throws ?? '—'}` : null,
    person.currentAge != null ? `Age ${person.currentAge}` : null,
  ].filter(Boolean)

  const seasonTeams = seasonTeamIds.map((id) => ({
    id,
    name: teamNameById.get(id),
  }))

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Box
          component="img"
          src={playerHeadshotUrl(person.id)}
          alt=""
          sx={{
            width: 84,
            height: 84,
            borderRadius: 1,
            objectFit: 'cover',
            bgcolor: 'action.hover',
            flexShrink: 0,
          }}
        />
        <Stack spacing={0.35} sx={{ minWidth: 0, flex: 1, pt: 0.25 }}>
          {seasonTeams.length > 0 ? (
            <Stack spacing={0.35}>
              {seasonTeams.map((t) => (
                <Stack
                  key={t.id}
                  direction="row"
                  spacing={0.75}
                  sx={{ alignItems: 'center', minWidth: 0 }}
                >
                  <TeamLogo teamId={t.id} alt={t.name ?? ''} size={22} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    {t.name ?? `Team ${t.id}`}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', flexWrap: 'wrap' }}
            >
              {currentTeam?.id != null && (
                <TeamLogo
                  teamId={currentTeam.id}
                  alt={currentTeam.name ?? ''}
                  size={22}
                />
              )}
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {currentTeam?.name ?? 'Free agent'}
              </Typography>
            </Stack>
          )}
          {metaBits.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              {metaBits.join(' · ')}
            </Typography>
          )}
        </Stack>
      </Stack>

      <CareerStatStrip group={group} stat={careerStat} />
    </Stack>
  )
}

function CareerStatStrip({
  group,
  stat,
}: {
  group: PlayerStatGroup
  stat?: Record<string, unknown>
}) {
  if (!stat) {
    return (
      <Typography variant="caption" color="text.secondary">
        No career {group} stats.
      </Typography>
    )
  }

  const items =
    group === 'hitting'
      ? [
          { label: 'G', value: formatStat(stat.gamesPlayed, '0') },
          { label: 'AVG', value: formatStat(stat.avg) },
          { label: 'HR', value: formatStat(stat.homeRuns, '0') },
          { label: 'RBI', value: formatStat(stat.rbi, '0') },
          { label: 'OPS', value: formatStat(stat.ops) },
          { label: 'SB', value: formatStat(stat.stolenBases, '0') },
        ]
      : [
          { label: 'G', value: formatStat(stat.gamesPlayed, '0') },
          {
            label: 'W-L',
            value: `${formatStat(stat.wins, '0')}-${formatStat(stat.losses, '0')}`,
          },
          { label: 'ERA', value: formatStat(stat.era) },
          { label: 'IP', value: formatStat(stat.inningsPitched) },
          { label: 'SO', value: formatStat(stat.strikeOuts, '0') },
          { label: 'WHIP', value: formatStat(stat.whip) },
        ]

  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}
      >
        Career
      </Typography>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        {items.map((item) => (
          <Box
            key={item.label}
            sx={{
              flex: 1,
              minWidth: 0,
              px: 0.5,
              py: 0.75,
              textAlign: 'center',
              borderRight: 1,
              borderColor: 'divider',
              '&:last-of-type': { borderRight: 0 },
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', fontWeight: 700, lineHeight: 1.1 }}
            >
              {item.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function GameLogTable({
  group,
  splits,
  teamAbbrById,
}: {
  group: PlayerStatGroup
  splits: NonNullable<ReturnType<typeof usePersonGameLog>['data']>
  teamAbbrById: Map<number, string>
}) {
  if (splits.length === 0) {
    return (
      <Typography color="text.secondary" variant="body2">
        No games in this season.
      </Typography>
    )
  }

  const teamIdsInLog = new Set<number>()
  for (const split of splits) {
    if (split.team?.id != null) teamIdsInLog.add(split.team.id)
  }
  const showTeamCol = teamIdsInLog.size > 1

  if (group === 'hitting') {
    return (
      <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
          <colgroup>
            <col style={{ width: hitCol.date }} />
            {showTeamCol && <col style={{ width: hitCol.tm }} />}
            <col style={{ width: showTeamCol ? hitCol.opp : '22%' }} />
            <col style={{ width: hitCol.wl }} />
            <col style={{ width: hitCol.stat }} />
            <col style={{ width: hitCol.stat }} />
            <col style={{ width: hitCol.stat }} />
            <col style={{ width: hitCol.stat }} />
            <col style={{ width: hitCol.stat }} />
            <col style={{ width: hitCol.stat }} />
            <col style={{ width: hitCol.stat }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell sx={firstHead}>Date</TableCell>
              {showTeamCol && <TableCell sx={headCell}>Tm</TableCell>}
              <TableCell sx={headCell}>Opp</TableCell>
              <TableCell sx={headCell} align="center">
                W/L
              </TableCell>
              <TableCell sx={headCell} align="right">
                AB
              </TableCell>
              <TableCell sx={headCell} align="right">
                R
              </TableCell>
              <TableCell sx={headCell} align="right">
                H
              </TableCell>
              <TableCell sx={headCell} align="right">
                HR
              </TableCell>
              <TableCell sx={headCell} align="right">
                RBI
              </TableCell>
              <TableCell sx={headCell} align="right">
                BB
              </TableCell>
              <TableCell sx={lastStatHead} align="right">
                K
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {splits.map((split, idx) => {
              const s = split.stat ?? {}
              const date = split.date ? formatMonthDay(split.date) : '—'
              return (
                <TableRow key={`${split.date}-${split.game?.gamePk ?? idx}`}>
                  <TableCell sx={firstCell}>{date}</TableCell>
                  {showTeamCol && (
                    <TableCell sx={cell}>
                      <PlayerTeamCell
                        teamId={split.team?.id}
                        teamName={split.team?.name}
                        abbr={
                          split.team?.abbreviation ??
                          (split.team?.id != null
                            ? teamAbbrById.get(split.team.id)
                            : undefined)
                        }
                      />
                    </TableCell>
                  )}
                  <TableCell sx={cell}>
                    <OpponentCell
                      isHome={split.isHome}
                      opponentId={split.opponent?.id}
                      opponentName={split.opponent?.name}
                      opponentAbbr={
                        split.opponent?.abbreviation ??
                        (split.opponent?.id != null
                          ? teamAbbrById.get(split.opponent.id)
                          : undefined)
                      }
                    />
                  </TableCell>
                  <TableCell sx={cell} align="center">
                    <ResultMark isWin={split.isWin} />
                  </TableCell>
                  <TableCell sx={cell} align="right">
                    {formatStat(s.atBats, '0')}
                  </TableCell>
                  <TableCell sx={cell} align="right">
                    {formatStat(s.runs, '0')}
                  </TableCell>
                  <TableCell sx={cell} align="right">
                    {formatStat(s.hits, '0')}
                  </TableCell>
                  <TableCell sx={cell} align="right">
                    {formatStat(s.homeRuns, '0')}
                  </TableCell>
                  <TableCell sx={cell} align="right">
                    {formatStat(s.rbi, '0')}
                  </TableCell>
                  <TableCell sx={cell} align="right">
                    {formatStat(s.baseOnBalls, '0')}
                  </TableCell>
                  <TableCell sx={lastStatCell} align="right">
                    {formatStat(s.strikeOuts, '0')}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
        <colgroup>
          <col style={{ width: pitchCol.date }} />
          {showTeamCol && <col style={{ width: pitchCol.tm }} />}
          <col style={{ width: showTeamCol ? pitchCol.opp : '20%' }} />
          <col style={{ width: pitchCol.wl }} />
          <col style={{ width: pitchCol.ip }} />
          <col style={{ width: pitchCol.stat }} />
          <col style={{ width: pitchCol.stat }} />
          <col style={{ width: pitchCol.stat }} />
          <col style={{ width: pitchCol.stat }} />
          <col style={{ width: pitchCol.stat }} />
          <col style={{ width: pitchCol.dec }} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell sx={firstHead}>Date</TableCell>
            {showTeamCol && <TableCell sx={headCell}>Tm</TableCell>}
            <TableCell sx={headCell}>Opp</TableCell>
            <TableCell sx={headCell} align="center">
              W/L
            </TableCell>
            <TableCell sx={headCell} align="right">
              IP
            </TableCell>
            <TableCell sx={headCell} align="right">
              H
            </TableCell>
            <TableCell sx={headCell} align="right">
              R
            </TableCell>
            <TableCell sx={headCell} align="right">
              ER
            </TableCell>
            <TableCell sx={headCell} align="right">
              BB
            </TableCell>
            <TableCell sx={headCell} align="right">
              K
            </TableCell>
            <TableCell sx={lastStatHead} align="right">
              DEC
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {splits.map((split, idx) => {
            const s = split.stat ?? {}
            const date = split.date ? formatMonthDay(split.date) : '—'
            const decision =
              Number(s.wins) > 0
                ? 'W'
                : Number(s.losses) > 0
                  ? 'L'
                  : Number(s.saves) > 0
                    ? 'SV'
                    : Number(s.holds) > 0
                      ? 'H'
                      : Number(s.blownSaves) > 0
                        ? 'BS'
                        : ''
            return (
              <TableRow key={`${split.date}-${split.game?.gamePk ?? idx}`}>
                <TableCell sx={firstCell}>{date}</TableCell>
                {showTeamCol && (
                  <TableCell sx={cell}>
                    <PlayerTeamCell
                      teamId={split.team?.id}
                      teamName={split.team?.name}
                      abbr={
                        split.team?.abbreviation ??
                        (split.team?.id != null
                          ? teamAbbrById.get(split.team.id)
                          : undefined)
                      }
                    />
                  </TableCell>
                )}
                <TableCell sx={cell}>
                  <OpponentCell
                    isHome={split.isHome}
                    opponentId={split.opponent?.id}
                    opponentName={split.opponent?.name}
                    opponentAbbr={
                      split.opponent?.abbreviation ??
                      (split.opponent?.id != null
                        ? teamAbbrById.get(split.opponent.id)
                        : undefined)
                    }
                  />
                </TableCell>
                <TableCell sx={cell} align="center">
                  <ResultMark isWin={split.isWin} />
                </TableCell>
                <TableCell sx={cell} align="right">
                  {formatStat(s.inningsPitched)}
                </TableCell>
                <TableCell sx={cell} align="right">
                  {formatStat(s.hits, '0')}
                </TableCell>
                <TableCell sx={cell} align="right">
                  {formatStat(s.runs, '0')}
                </TableCell>
                <TableCell sx={cell} align="right">
                  {formatStat(s.earnedRuns, '0')}
                </TableCell>
                <TableCell sx={cell} align="right">
                  {formatStat(s.baseOnBalls, '0')}
                </TableCell>
                <TableCell sx={cell} align="right">
                  {formatStat(s.strikeOuts, '0')}
                </TableCell>
                <TableCell sx={{ ...lastStatCell, fontWeight: 700 }} align="right">
                  {decision}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function PlayerTeamCell({
  teamId,
  teamName,
  abbr,
}: {
  teamId?: number
  teamName?: string
  abbr?: string
}) {
  const label = abbr ?? '—'
  return (
    <Stack
      direction="row"
      spacing={0.35}
      sx={{ alignItems: 'center', minWidth: 0 }}
      title={teamName}
    >
      {teamId != null && <TeamLogo teamId={teamId} alt={teamName ?? label} size={14} />}
      <Typography
        component="span"
        variant="caption"
        sx={{ fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1 }}
      >
        {label}
      </Typography>
    </Stack>
  )
}

function OpponentCell({
  isHome,
  opponentId,
  opponentName,
  opponentAbbr,
}: {
  isHome?: boolean
  opponentId?: number
  opponentName?: string
  opponentAbbr?: string
}) {
  const abbr = opponentAbbr ?? '—'
  return (
    <Stack
      direction="row"
      spacing={0.35}
      sx={{ alignItems: 'center', minWidth: 0 }}
      title={opponentName}
    >
      <Typography
        component="span"
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 700, flexShrink: 0, lineHeight: 1 }}
      >
        {isHome ? 'vs' : '@'}
      </Typography>
      {opponentId != null && (
        <TeamLogo teamId={opponentId} alt={opponentName ?? abbr} size={14} />
      )}
      <Typography
        component="span"
        variant="caption"
        sx={{ fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1 }}
      >
        {abbr}
      </Typography>
    </Stack>
  )
}

function ResultMark({ isWin }: { isWin?: boolean }) {
  if (isWin == null) {
    return (
      <Typography component="span" variant="caption" color="text.secondary">
        —
      </Typography>
    )
  }
  return (
    <Typography
      component="span"
      variant="caption"
      sx={{
        fontWeight: 800,
        color: isWin ? 'success.dark' : 'error.dark',
      }}
    >
      {isWin ? 'W' : 'L'}
    </Typography>
  )
}
