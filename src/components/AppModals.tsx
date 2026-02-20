/**
 * AppModals - Single location for rendering all application modals
 *
 * This component reads from ModalContext and renders the appropriate modal
 * based on the current state. Rendered at the root level for:
 * - Single modal instance (better performance)
 * - Consistent z-index stacking
 * - Centralized modal management
 */

import type { PersonStatsItem, PersonStatSplit } from '@bp1222/stats-api'
import CloseIcon from '@mui/icons-material/Close'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { lazy, Suspense } from 'react'

import { useModalState } from '@/context/ModalContext'
import { usePerson } from '@/queries/person'
import { useTeams } from '@/queries/team'
import { Game } from '@/types/Game'
import { GameStatus } from '@/types/Game/GameStatus'
import type { Team } from '@/types/Team'

const GameBoxscore = lazy(() =>
  import('@/features/game/components/GameBoxscore').then((module) => ({
    default: module.GameBoxscore,
  })),
)

/** Season stats table for one stat group (e.g. hitting yearByYear) */
const SeasonStatsTable = ({
  statItem,
  title,
  statColumns,
}: {
  statItem: PersonStatsItem
  title: string
  statColumns: { key: string; label: string }[]
}) => {
  const { data: teams } = useTeams()
  // Exclude season summary rows (no team, numTeams present) — keep only per-team lines
  const splits = (statItem.splits ?? []).filter((s) => s.team != undefined || s.numTeams == undefined)
  console.log(splits)

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

/**
 * Player modal content – person info and career season stats
 */
const PlayerModalContent = ({ personId, onClose }: { personId: string; onClose: () => void }) => {
  const { data: person, isPending, isError, refetch } = usePerson(personId)

  if (isPending) {
    return (
      <Modal open disableAutoFocus onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(100vw - 24px)',
            maxWidth: 560,
            maxHeight: 'calc(100vh - 24px)',
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            border: '2px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'auto',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200,
          }}
        >
          <IconButton aria-label="Close" onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>
          <CircularProgress />
        </Box>
      </Modal>
    )
  }

  if (isError || !person) {
    return (
      <Modal open disableAutoFocus onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(100vw - 24px)',
            maxWidth: 560,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            border: '2px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 2,
            outline: 'none',
          }}
        >
          <IconButton aria-label="Close" onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>
          <Alert severity="error">Could not load player.</Alert>
          <Button size="small" onClick={() => void refetch()} sx={{ mt: 1 }}>
            Retry
          </Button>
          <Button size="small" onClick={onClose} sx={{ mt: 1, ml: 1 }}>
            Close
          </Button>
        </Box>
      </Modal>
    )
  }

  const isPrimaryPitcher = person.primaryPosition?.abbreviation === 'P' || person.primaryPosition?.type === 'Pitcher'

  const hittingStatsRaw = person.stats?.find(
    (s) => s.type?.displayName === 'yearByYear' && s.group?.displayName === 'hitting',
  )
  const pitchingStats = person.stats?.find(
    (s) => s.type?.displayName === 'yearByYear' && s.group?.displayName === 'pitching',
  )

  // For primary pitchers, only show hitting seasons where they had at least one at bat
  const hittingStats =
    hittingStatsRaw && isPrimaryPitcher && hittingStatsRaw.splits
      ? {
          ...hittingStatsRaw,
          splits: hittingStatsRaw.splits.filter((s) => (s.stat?.atBats ?? 0) > 0),
        }
      : hittingStatsRaw

  const hittingColumns = [
    { key: 'gamesPlayed', label: 'G' },
    { key: 'atBats', label: 'AB' },
    { key: 'runs', label: 'R' },
    { key: 'hits', label: 'H' },
    { key: 'homeRuns', label: 'HR' },
    { key: 'rbi', label: 'RBI' },
    { key: 'avg', label: 'AVG' },
    { key: 'ops', label: 'OPS' },
  ]
  const pitchingColumns = [
    { key: 'gamesPlayed', label: 'G' },
    { key: 'inningsPitched', label: 'IP' },
    { key: 'wins', label: 'W' },
    { key: 'losses', label: 'L' },
    { key: 'era', label: 'ERA' },
    { key: 'strikeOuts', label: 'SO' },
    { key: 'baseOnBalls', label: 'BB' },
  ]

  const position = person.primaryPosition?.abbreviation ?? person.primaryPosition?.name ?? ''
  const team = person.currentTeam?.abbreviation ?? person.currentTeam?.teamName ?? ''

  return (
    <Modal open disableAutoFocus onClick={(e) => e.stopPropagation()} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100vw - 24px)',
          maxWidth: 560,
          maxHeight: 'calc(100vh - 24px)',
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          border: '2px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'auto',
          outline: 'none',
          px: 2,
          py: 2,
        }}
      >
        <IconButton aria-label="Close" onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, mb: 2 }}>
          <Typography variant="h6" component="p">
            {person.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {[position, team, person.primaryNumber ? `#${person.primaryNumber}` : ''].filter(Boolean).join(' · ')}
          </Typography>
          {(person.batSide?.description || person.pitchHand?.description) && (
            <Typography variant="caption" color="text.secondary" display="block">
              Bats: {person.batSide?.description ?? '—'} · Throws: {person.pitchHand?.description ?? '—'}
            </Typography>
          )}
        </Box>

        {hittingStats && (
          <SeasonStatsTable statItem={hittingStats} title="Hitting (by season)" statColumns={hittingColumns} />
        )}
        {pitchingStats && (
          <SeasonStatsTable statItem={pitchingStats} title="Pitching (by season)" statColumns={pitchingColumns} />
        )}
        {!hittingStats && !pitchingStats && (
          <Typography variant="body2" color="text.secondary">
            No season stats available.
          </Typography>
        )}
      </Box>
    </Modal>
  )
}

/**
 * Boxscore modal content
 */
const BoxscoreModalContent = ({ game, onClose }: { game: Game; onClose: () => void }) => {
  const { data: teams } = useTeams()

  const awayAbbr = teams?.find((t: Team) => t.id === game.away.teamId)?.abbreviation ?? 'Away'
  const homeAbbr = teams?.find((t: Team) => t.id === game.home.teamId)?.abbreviation ?? 'Home'
  const awayScore = game.away.score ?? 0
  const homeScore = game.home.score ?? 0

  const statusLabel =
    game.gameStatus === GameStatus.Final
      ? 'Final'
      : game.gameStatus === GameStatus.InProgress
        ? 'Live'
        : game.gameStatus === GameStatus.Scheduled
          ? dayjs(game.gameDate).format('h:mm A')
          : game.gameStatus === GameStatus.Postponed
            ? 'Postponed'
            : game.gameStatus === GameStatus.Canceled
              ? 'Canceled'
              : ''

  return (
    <Modal open disableAutoFocus onClick={(e) => e.stopPropagation()} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100vw - 24px)',
          maxWidth: 850,
          maxHeight: 'calc(100vh - 24px)',
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          border: '2px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'auto',
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Sticky header: stays at top while GameBoxscore scrolls underneath */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            padding: { xs: 1.5, sm: 2 },
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ width: 48, flexShrink: 0 }} aria-hidden />
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h6"
              component="p"
              sx={{
                fontSize: { xs: '1rem', sm: 'inherit' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {awayAbbr} @ {homeAbbr}
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '0.875rem', sm: 'inherit' } }}>
              {awayScore} – {homeScore}
              {statusLabel ? ` · ${statusLabel}` : ''}
            </Typography>
          </Box>
          <IconButton aria-label="Close" onClick={onClose} sx={{ flexShrink: 0 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            minWidth: 0,
            flex: '1 1 0%',
            overflow: 'auto',
          }}
        >
          <Suspense
            fallback={
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={200} padding={2}>
                <CircularProgress />
              </Box>
            }
          >
            <GameBoxscore game={game} embedded />
          </Suspense>
        </Box>
      </Box>
    </Modal>
  )
}

/**
 * Main AppModals component - renders the modal stack (e.g. boxscore with player on top).
 * Closing the top modal pops the stack, so closing the player modal returns to the boxscore.
 */
export const AppModals = () => {
  const { stack, close } = useModalState()

  return (
    <>
      {stack.map((item) => {
        if (item.type === 'boxscore') {
          return <BoxscoreModalContent key={`boxscore-${item.data.pk}`} game={item.data} onClose={close} />
        }
        if (item.type === 'player') {
          return <PlayerModalContent key={`player-${item.data}`} personId={item.data} onClose={close} />
        }
        return null
      })}
    </>
  )
}
