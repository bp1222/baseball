import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
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
import type {
  BoxscoreInfoItem,
  BoxscoreTeam,
  BoxscoreTeamInfoSection,
  Game,
  GameDecisions,
  Linescore,
  Person,
  Player,
  ProbablePitchers,
} from '@bp1222/stats-api'
import { useState, useEffect, type MouseEvent, type ReactNode } from 'react'
import { useGameDetail } from '../api/gameDetail'
import {
  formatInningRuns,
  formatLinescoreInning,
  formatOutsLabel,
  linescoreBases,
  linescoreHasStarted,
  padLinescoreInnings,
} from '../lib/linescore'
import {
  formatGameStartTime,
  formatMonthDay,
  gameStatusFooter,
  isGameFinal,
  isGameLive,
} from '../lib/series'
import { BasePaths, OutsDots } from './BasesOuts'
import { PlayerDetailModal } from './PlayerDetailModal'
import { TeamLogo } from './TeamLogo'

type GameDetailModalProps = {
  game: Game
  open: boolean
  onClose: () => void
}

export function GameDetailModal({ game, open, onClose }: GameDetailModalProps) {
  const detailQuery = useGameDetail(game, open)
  const [side, setSide] = useState<'away' | 'home'>('away')
  const [playerId, setPlayerId] = useState<number | null>(null)

  useEffect(() => {
    if (!open) setPlayerId(null)
  }, [open])

  const box = detailQuery.data?.boxscore
  const linescore = detailQuery.data?.linescore
  const feed = detailQuery.data?.feed
  const gameData = feed?.gameData

  const away = game.teams.away
  const home = game.teams.home
  const final = isGameFinal(game)
  const live = isGameLive(game)

  const awayRuns = linescore?.teams?.away?.runs ?? away.score
  const homeRuns = linescore?.teams?.home?.runs ?? home.score

  const statusLabel =
    live && linescore && linescoreHasStarted(linescore)
      ? formatLinescoreInning(linescore)
      : gameStatusFooter(game)

  const gameStarted = final || live || linescoreHasStarted(linescore)

  const weather = gameData?.weather
  const venue = gameData?.venue ?? game.venue
  const decisions = feed?.liveData?.decisions
  const probable = gameData?.probablePitchers
  const startTime = formatGameStartTime(game)

  const metaFromInfo = (box?.info ?? []).filter((i) =>
    META_STRIP_LABELS.has(i.label ?? ''),
  )

  const gameNotes = (box?.info ?? []).filter((i) => isGameNoteItem(i))

  const openPlayer = (id: number) => setPlayerId(id)

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
        aria-labelledby="game-detail-title"
      >
        <DialogTitle
          id="game-detail-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            pr: 1,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
            <Typography variant="h6" component="div" sx={{ lineHeight: 1.2 }}>
              {away.team.abbreviation ?? 'AWY'} @ {home.team.abbreviation ?? 'HME'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatMonthDay(game.officialDate || game.gameDate.slice(0, 10))}
              {startTime ? ` · ${startTime}` : ''}
            </Typography>
          </Box>
          <IconButton aria-label="Close" onClick={onClose} size="small">
            ×
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 2 }}>
          {detailQuery.isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={32} />
            </Box>
          )}

          {detailQuery.isError && (
            <Typography color="error" sx={{ py: 2 }}>
              Couldn’t load game details. Try again in a moment.
            </Typography>
          )}

          {detailQuery.isSuccess && box && (
            <Stack spacing={2.5}>
              <ScoreHero
                game={game}
                awayRuns={awayRuns}
                homeRuns={homeRuns}
                statusLabel={statusLabel}
                linescore={
                  live && linescore && linescoreHasStarted(linescore)
                    ? linescore
                    : undefined
                }
              />

              <MetaStrip
                venueName={venue?.name}
                weather={weather}
                attendance={gameData?.gameInfo?.attendance}
                gameDuration={gameData?.gameInfo?.gameDurationMinutes}
                infoItems={metaFromInfo}
              />

              {(linescore || game.scheduledInnings) && (
                <LinescoreTable
                  linescore={linescore}
                  scheduledInnings={game.scheduledInnings}
                  gameFinal={final}
                  awayLabel={
                    away.team.teamName ??
                    away.team.abbreviation ??
                    away.team.shortName ??
                    'Away'
                  }
                  homeLabel={
                    home.team.teamName ??
                    home.team.abbreviation ??
                    home.team.shortName ??
                    'Home'
                  }
                />
              )}

              {(decisions || (!gameStarted && probable)) && (
                <PitchingDecisions
                  decisions={decisions}
                  probable={probable}
                  gameStarted={gameStarted}
                  onPlayerClick={openPlayer}
                />
              )}

              <Box>
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={side}
                  onChange={(_, v) => {
                    if (v) setSide(v)
                  }}
                  sx={{ mb: 1.5 }}
                >
                  <ToggleButton value="away">
                    {away.team.teamName ?? away.team.abbreviation ?? 'Away'}
                  </ToggleButton>
                  <ToggleButton value="home">
                    {home.team.teamName ?? home.team.abbreviation ?? 'Home'}
                  </ToggleButton>
                </ToggleButtonGroup>

                <TeamBoxscorePanel
                  team={side === 'away' ? box.teams.away : box.teams.home}
                  onPlayerClick={openPlayer}
                />
              </Box>

              {gameNotes.length > 0 && <GameNotes items={gameNotes} />}
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      <PlayerDetailModal
        personId={playerId}
        open={playerId != null}
        onClose={() => setPlayerId(null)}
        defaultSeason={game.season}
      />
    </>
  )
}

const META_STRIP_LABELS = new Set(['Weather', 'Wind', 'Venue', 'Att', 'T', 'First pitch'])

function isGameNoteItem(item: BoxscoreInfoItem): boolean {
  const label = (item.label ?? '').trim()
  if (!label || META_STRIP_LABELS.has(label)) return false
  // Trailing date-only row, e.g. "July 26, 2026"
  if (item.value == null || item.value === '') return false
  if (/^[A-Za-z]+ \d{1,2}, \d{4}$/.test(label)) return false
  return true
}

function ScoreHero({
  game,
  awayRuns,
  homeRuns,
  statusLabel,
  linescore,
}: {
  game: Game
  awayRuns?: number
  homeRuns?: number
  statusLabel: string
  linescore?: Linescore
}) {
  const away = game.teams.away
  const home = game.teams.home
  const bases = linescoreBases(linescore)
  const outs = linescore?.outs
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 1.5, sm: 3 },
        py: 1,
      }}
    >
      <Stack sx={{ alignItems: 'center', minWidth: 72 }}>
        <TeamLogo teamId={away.team.id} alt={away.team.name} size={48} />
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          {away.team.abbreviation}
        </Typography>
        {away.leagueRecord && (
          <Typography variant="caption" color="text.secondary">
            {away.leagueRecord.wins}-{away.leagueRecord.losses}
          </Typography>
        )}
      </Stack>

      <Stack sx={{ alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
          {awayRuns ?? '—'}{' '}
          <Typography component="span" color="text.secondary" variant="h5">
            –
          </Typography>{' '}
          {homeRuns ?? '—'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          {statusLabel}
        </Typography>
        {linescore && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mt: 0.75,
              color: 'secondary.main',
            }}
            title={formatOutsLabel(outs)}
          >
            <BasePaths bases={bases} size="md" />
            <OutsDots outs={outs ?? 0} size="md" />
          </Box>
        )}
      </Stack>

      <Stack sx={{ alignItems: 'center', minWidth: 72 }}>
        <TeamLogo teamId={home.team.id} alt={home.team.name} size={48} />
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          {home.team.abbreviation}
        </Typography>
        {home.leagueRecord && (
          <Typography variant="caption" color="text.secondary">
            {home.leagueRecord.wins}-{home.leagueRecord.losses}
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}

function LinescoreTable({
  linescore,
  scheduledInnings,
  gameFinal,
  awayLabel,
  homeLabel,
}: {
  linescore?: Linescore
  scheduledInnings?: number
  gameFinal: boolean
  awayLabel: string
  homeLabel: string
}) {
  const innings = padLinescoreInnings(linescore, scheduledInnings)
  const cellSx = { px: 0.75, py: 0.5, fontSize: '0.75rem' }
  const rheSx = {
    px: 0.5,
    py: 0.5,
    fontSize: '0.75rem',
    textAlign: 'center' as const,
  }
  const labels = { away: awayLabel, home: homeLabel } as const
  return (
    <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Table size="small" sx={{ width: '100%' }}>
        <colgroup>
          <col />
          {innings.map((inn) => (
            <col key={inn.num} />
          ))}
          <col style={{ width: '0.75rem' }} />
          <col style={{ width: '2.25rem' }} />
          <col style={{ width: '2.25rem' }} />
          <col style={{ width: '2.25rem' }} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell sx={cellSx} />
            {innings.map((inn) => (
              <TableCell key={inn.num} align="center" sx={cellSx}>
                {inn.num}
              </TableCell>
            ))}
            <TableCell sx={{ p: 0, borderLeft: 1, borderColor: 'divider' }} aria-hidden />
            <TableCell align="center" sx={{ ...rheSx, fontWeight: 700 }}>
              R
            </TableCell>
            <TableCell align="center" sx={{ ...rheSx, fontWeight: 700 }}>
              H
            </TableCell>
            <TableCell align="center" sx={{ ...rheSx, fontWeight: 700 }}>
              E
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(['away', 'home'] as const).map((side) => (
            <TableRow key={side}>
              <TableCell sx={{ ...cellSx, fontWeight: 700 }}>{labels[side]}</TableCell>
              {innings.map((inn) => (
                <TableCell key={inn.num} align="center" sx={cellSx}>
                  {formatInningRuns(inn[side]?.runs, gameFinal)}
                </TableCell>
              ))}
              <TableCell
                sx={{ p: 0, borderLeft: 1, borderColor: 'divider' }}
                aria-hidden
              />
              <TableCell align="center" sx={{ ...rheSx, fontWeight: 700 }}>
                {linescore?.teams?.[side]?.runs ?? ''}
              </TableCell>
              <TableCell align="center" sx={rheSx}>
                {linescore?.teams?.[side]?.hits ?? ''}
              </TableCell>
              <TableCell align="center" sx={rheSx}>
                {linescore?.teams?.[side]?.errors ?? ''}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function MetaStrip({
  venueName,
  weather,
  attendance,
  gameDuration,
  infoItems,
}: {
  venueName?: string
  weather?: { condition?: string; temp?: string; wind?: string }
  attendance?: number
  gameDuration?: number
  infoItems: Array<{ label?: string; value?: string }>
}) {
  const fieldLabel =
    venueName ?? infoItems.find((i) => i.label === 'Venue')?.value?.replace(/\.$/, '')

  const detailBits: string[] = []
  if (weather?.temp || weather?.condition) {
    detailBits.push(
      [weather.temp ? `${weather.temp}°` : null, weather.condition]
        .filter(Boolean)
        .join(', '),
    )
  } else {
    const w = infoItems.find((i) => i.label === 'Weather')?.value
    if (w) detailBits.push(w.replace(/\.$/, ''))
  }
  if (weather?.wind && weather.wind !== '0 mph, None') {
    detailBits.push(weather.wind)
  } else {
    const wind = infoItems.find((i) => i.label === 'Wind')?.value
    if (wind && !wind.startsWith('0 mph')) detailBits.push(wind.replace(/\.$/, ''))
  }

  if (gameDuration != null) {
    const h = Math.floor(gameDuration / 60)
    const m = gameDuration % 60
    detailBits.push(h > 0 ? `${h}:${String(m).padStart(2, '0')}` : `${m}m`)
  } else {
    const t = infoItems.find((i) => i.label === 'T')?.value
    if (t) detailBits.push(t.trim())
  }

  if (attendance != null) {
    detailBits.push(`Att ${attendance.toLocaleString()}`)
  } else {
    const att = infoItems.find((i) => i.label === 'Att')?.value
    if (att) detailBits.push(`Att ${att.trim().replace(/\.$/, '')}`)
  }

  if (!fieldLabel && detailBits.length === 0) return null

  return (
    <Stack spacing={0.25} sx={{ alignItems: 'center', color: 'text.secondary' }}>
      {fieldLabel && (
        <Typography variant="caption" sx={{ fontWeight: 600, textAlign: 'center' }}>
          {fieldLabel}
        </Typography>
      )}
      {detailBits.length > 0 && (
        <Typography variant="caption" sx={{ textAlign: 'center' }}>
          {detailBits.join(' · ')}
        </Typography>
      )}
    </Stack>
  )
}

function PitchingDecisions({
  decisions,
  probable,
  gameStarted,
  onPlayerClick,
}: {
  decisions?: GameDecisions
  probable?: ProbablePitchers
  gameStarted: boolean
  onPlayerClick: (personId: number) => void
}) {
  if (decisions?.winner || decisions?.loser || decisions?.save) {
    return (
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: 'center', flexWrap: 'wrap' }}
      >
        {decisions.winner && (
          <Typography variant="caption">
            <Box
              component="span"
              sx={{ fontWeight: 800, color: 'success.dark', mr: 0.5 }}
            >
              W
            </Box>
            <PlayerNameLink person={decisions.winner} onPlayerClick={onPlayerClick} />
          </Typography>
        )}
        {decisions.loser && (
          <Typography variant="caption">
            <Box component="span" sx={{ fontWeight: 800, color: 'error.dark', mr: 0.5 }}>
              L
            </Box>
            <PlayerNameLink person={decisions.loser} onPlayerClick={onPlayerClick} />
          </Typography>
        )}
        {decisions.save && (
          <Typography variant="caption">
            <Box
              component="span"
              sx={{ fontWeight: 800, color: 'primary.main', mr: 0.5 }}
            >
              SV
            </Box>
            <PlayerNameLink person={decisions.save} onPlayerClick={onPlayerClick} />
          </Typography>
        )}
      </Stack>
    )
  }

  if (!gameStarted && probable && (probable.away || probable.home)) {
    return (
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
        Probables:{' '}
        {probable.away ? (
          <PlayerNameLink person={probable.away} onPlayerClick={onPlayerClick} />
        ) : (
          'TBD'
        )}{' '}
        vs{' '}
        {probable.home ? (
          <PlayerNameLink person={probable.home} onPlayerClick={onPlayerClick} />
        ) : (
          'TBD'
        )}
      </Typography>
    )
  }

  return null
}

function PlayerNameLink({
  person,
  onPlayerClick,
  children,
}: {
  person: Pick<Person, 'id' | 'fullName' | 'boxscoreName'>
  onPlayerClick: (personId: number) => void
  children?: ReactNode
}) {
  const label = children ?? person.boxscoreName ?? person.fullName
  if (!person.id) return <>{label}</>
  return (
    <Link
      component="button"
      type="button"
      underline="hover"
      color="inherit"
      onClick={(e: MouseEvent) => {
        e.stopPropagation()
        onPlayerClick(person.id)
      }}
      sx={{
        font: 'inherit',
        fontWeight: 'inherit',
        verticalAlign: 'baseline',
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      {label}
    </Link>
  )
}

function playerKey(id: number) {
  return `ID${id}`
}

function lineupBatters(team: BoxscoreTeam): Player[] {
  return Object.values(team.players)
    .filter((p) => Boolean(p.battingOrder))
    .sort((a, b) => Number(a.battingOrder) - Number(b.battingOrder))
}

function isSubstituteBatter(player: Player): boolean {
  if (player.gameStatus?.isSubstitute) return true
  const order = player.battingOrder
  return Boolean(order && !order.endsWith('00'))
}

const batCol = {
  player: '46%',
  stat: '9%',
} as const

const pitchCol = {
  pitcher: '40%',
  ip: '12%',
  stat: '9.6%',
} as const

const cell = { px: 0.75, py: 0.4, fontSize: '0.75rem' } as const
const headCell = {
  ...cell,
  py: 0.65,
  fontSize: '0.8rem',
  fontWeight: 700,
} as const

function TeamBoxscorePanel({
  team,
  onPlayerClick,
}: {
  team: BoxscoreTeam
  onPlayerClick: (personId: number) => void
}) {
  const batters = lineupBatters(team)
  const pitchers = (team.pitchers ?? [])
    .map((id) => team.players[playerKey(id)])
    .filter((p): p is Player => Boolean(p))

  return (
    <Stack spacing={2}>
      <Box>
        {batters.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Lineup not available yet.
          </Typography>
        ) : (
          <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
              <colgroup>
                <col style={{ width: batCol.player }} />
                <col style={{ width: batCol.stat }} />
                <col style={{ width: batCol.stat }} />
                <col style={{ width: batCol.stat }} />
                <col style={{ width: batCol.stat }} />
                <col style={{ width: batCol.stat }} />
                <col style={{ width: batCol.stat }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell sx={headCell}>Batter</TableCell>
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
                    RBI
                  </TableCell>
                  <TableCell sx={headCell} align="right">
                    BB
                  </TableCell>
                  <TableCell sx={headCell} align="right">
                    K
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batters.map((p) => {
                  const b = p.stats?.batting
                  const sub = isSubstituteBatter(p)
                  const name = p.person.boxscoreName ?? p.person.fullName
                  const pos = p.position.abbreviation
                  const note = b?.note ?? p.note
                  return (
                    <TableRow key={p.person.id}>
                      <TableCell
                        sx={{
                          ...cell,
                          pl: sub ? 2.5 : 0.75,
                          fontStyle: sub ? 'italic' : undefined,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={p.person.fullName}
                      >
                        {note ? (
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{ mr: 0.5 }}
                          >
                            {note}
                          </Typography>
                        ) : null}
                        <PlayerNameLink person={p.person} onPlayerClick={onPlayerClick}>
                          {name}
                        </PlayerNameLink>
                        {pos ? (
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 0.75, fontWeight: 600 }}
                          >
                            {pos}
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell sx={cell} align="right">
                        {b?.atBats ?? 0}
                      </TableCell>
                      <TableCell sx={cell} align="right">
                        {b?.runs ?? 0}
                      </TableCell>
                      <TableCell sx={cell} align="right">
                        {b?.hits ?? 0}
                      </TableCell>
                      <TableCell sx={cell} align="right">
                        {b?.rbi ?? 0}
                      </TableCell>
                      <TableCell sx={cell} align="right">
                        {b?.baseOnBalls ?? 0}
                      </TableCell>
                      <TableCell sx={cell} align="right">
                        {b?.strikeOuts ?? 0}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Divider />

      <Box>
        {pitchers.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Pitching lines not available yet.
          </Typography>
        ) : (
          <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
              <colgroup>
                <col style={{ width: pitchCol.pitcher }} />
                <col style={{ width: pitchCol.ip }} />
                <col style={{ width: pitchCol.stat }} />
                <col style={{ width: pitchCol.stat }} />
                <col style={{ width: pitchCol.stat }} />
                <col style={{ width: pitchCol.stat }} />
                <col style={{ width: pitchCol.stat }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell sx={headCell}>Pitcher</TableCell>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {pitchers.map((p) => {
                  const pit = p.stats?.pitching
                  const note = pit?.note ?? p.note
                  return (
                    <TableRow key={p.person.id}>
                      <TableCell
                        sx={{
                          ...cell,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={p.person.fullName}
                      >
                        <PlayerNameLink person={p.person} onPlayerClick={onPlayerClick}>
                          {p.person.boxscoreName ?? p.person.fullName}
                        </PlayerNameLink>
                        {note ? (
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 0.5 }}
                          >
                            {note}
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell sx={cell} align="right">
                        {pit?.inningsPitched ?? '—'}
                      </TableCell>
                      <TableCell sx={cell} align="right">
                        {pit?.hits ?? 0}
                      </TableCell>
                      <TableCell sx={cell} align="right">
                        {pit?.runs ?? 0}
                      </TableCell>
                      <TableCell sx={cell} align="right">
                        {pit?.earnedRuns ?? 0}
                      </TableCell>
                      <TableCell sx={cell} align="right">
                        {pit?.baseOnBalls ?? 0}
                      </TableCell>
                      <TableCell sx={cell} align="right">
                        {pit?.strikeOuts ?? 0}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <TeamNotes sections={team.info} notes={team.note} />
    </Stack>
  )
}

function TeamNotes({
  sections,
  notes,
}: {
  sections?: BoxscoreTeamInfoSection[]
  notes?: Array<{ label?: string; value?: string }>
}) {
  const hasSections = (sections ?? []).some((s) => (s.fieldList?.length ?? 0) > 0)
  const hasNotes = (notes ?? []).length > 0
  if (!hasSections && !hasNotes) return null

  return (
    <Box sx={{ pt: 0.5 }}>
      <Typography variant="subtitle2" gutterBottom color="text.secondary">
        Team notes
      </Typography>
      <Stack spacing={1}>
        {(sections ?? []).map((section) => {
          const fields = section.fieldList ?? []
          if (fields.length === 0) return null
          return (
            <Box key={section.title ?? fields[0]?.label}>
              {section.title && (
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, display: 'block', mb: 0.25 }}
                >
                  {section.title}
                </Typography>
              )}
              {fields.map((f) => (
                <Typography
                  key={`${section.title}-${f.label}`}
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', lineHeight: 1.45 }}
                >
                  <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {f.label}:
                  </Box>{' '}
                  {f.value}
                </Typography>
              ))}
            </Box>
          )
        })}
        {hasNotes && (
          <Box>
            {(notes ?? []).map((n) => (
              <Typography
                key={n.label}
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', lineHeight: 1.45 }}
              >
                <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {n.label}-
                </Box>{' '}
                {n.value}
              </Typography>
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  )
}

function GameNotes({ items }: { items: BoxscoreInfoItem[] }) {
  if (items.length === 0) return null
  return (
    <Box>
      <Divider sx={{ mb: 1.5 }} />
      <Typography variant="subtitle2" gutterBottom color="text.secondary">
        Game notes
      </Typography>
      <Stack spacing={0.35}>
        {items.map((item) => (
          <Typography
            key={item.label}
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', lineHeight: 1.45 }}
          >
            <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {item.label}:
            </Box>{' '}
            {item.value}
          </Typography>
        ))}
      </Stack>
    </Box>
  )
}
