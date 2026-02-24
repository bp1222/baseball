import CloseIcon from '@mui/icons-material/Close'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'

import { usePerson, usePersonGameLog } from '@/queries/person'
import type { GameLogSplit } from '@/types/GameLogSplit'

import { GameLogTable } from './GameLogTable'
import { SeasonStatsTable } from './SeasonStatsTable'

type PlayerModalProps = {
  personId: string
  onClose: () => void
}

export const PlayerModal = ({ personId, onClose }: PlayerModalProps) => {
  const { data: person, isPending, isError, refetch } = usePerson(personId)

  const seasons = useMemo(() => {
    if (!person?.stats) return []
    const set = new Set<string>()
    const hitting = person.stats.find((s) => s.type?.displayName === 'yearByYear' && s.group?.displayName === 'hitting')
    const pitching = person.stats.find(
      (s) => s.type?.displayName === 'yearByYear' && s.group?.displayName === 'pitching',
    )
    hitting?.splits?.forEach((s) => s.season && set.add(s.season))
    pitching?.splits?.forEach((s) => s.season && set.add(s.season))
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [person?.stats])

  const [selectedSeason, setSelectedSeason] = useState<string | null>(null)
  const hittingGameLog = usePersonGameLog(personId, selectedSeason, 'hitting')
  const pitchingGameLog = usePersonGameLog(personId, selectedSeason, 'pitching')

  const modalSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1.5,
    boxSizing: 'border-box',
    paddingTop: 'max(12px, env(safe-area-inset-top, 0px))',
    paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))',
  }

  const contentBoxSx = {
    width: '100%',
    maxWidth: 560,
    maxHeight: '100%',
    boxSizing: 'border-box',
    bgcolor: 'background.paper',
    border: '2px solid',
    borderColor: 'divider',
    borderRadius: 2,
    overflow: 'auto',
  }

  if (isPending) {
    return (
      <Modal open disableAutoFocus onClose={onClose} sx={modalSx}>
        <Box
          sx={{
            ...contentBoxSx,
            position: 'relative',
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
      <Modal open disableAutoFocus onClose={onClose} sx={modalSx}>
        <Box sx={{ ...contentBoxSx, position: 'relative', p: 2 }}>
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
    <Modal open disableAutoFocus onClick={(e) => e.stopPropagation()} onClose={onClose} sx={modalSx}>
      <Box
        id="player-modal"
        sx={{
          ...contentBoxSx,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          id="player-modal-header"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
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
              {person.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: 'inherit' } }}>
              {[position, team, person.primaryNumber ? `#${person.primaryNumber}` : ''].filter(Boolean).join(' · ')}
            </Typography>
            {(person.batSide?.description || person.pitchHand?.description) && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ fontSize: { xs: '0.75rem', sm: 'inherit' } }}
              >
                Bats: {person.batSide?.description ?? '—'} · Throws: {person.pitchHand?.description ?? '—'}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              flexShrink: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconButton aria-label="Close" onClick={onClose} sx={{ flexShrink: 0 }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            minWidth: 0,
            minHeight: 0,
            flex: '1 1 0%',
            overflow: 'auto',
            px: 2,
            py: 2,
          }}
        >
          {seasons.length > 0 && (
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="game-log-season-label">Game log (by season)</InputLabel>
                <Select
                  labelId="game-log-season-label"
                  label="Game log (by season)"
                  value={selectedSeason ?? ''}
                  onChange={(e) => setSelectedSeason(e.target.value || null)}
                >
                  {seasons.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedSeason && (
                <Button size="small" variant="outlined" onClick={() => setSelectedSeason(null)}>
                  Clear
                </Button>
              )}
              {selectedSeason && (
                <Box sx={{ mt: 2 }}>
                  {(hittingStats && hittingGameLog.isPending) || (pitchingStats && pitchingGameLog.isPending) ? (
                    <Box display="flex" justifyContent="center" py={2}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <>
                      {hittingStats && hittingGameLog.data != null && hittingGameLog.data.length > 0 && (
                        <GameLogTable
                          title={`Hitting game log · ${selectedSeason}`}
                          splits={hittingGameLog.data as GameLogSplit[]}
                          group="hitting"
                        />
                      )}
                      {pitchingStats && pitchingGameLog.data != null && pitchingGameLog.data.length > 0 && (
                        <GameLogTable
                          title={`Pitching game log · ${selectedSeason}`}
                          splits={pitchingGameLog.data as GameLogSplit[]}
                          group="pitching"
                        />
                      )}
                      {(hittingStats && hittingGameLog.data?.length === 0 && !pitchingStats) ||
                      (pitchingStats && pitchingGameLog.data?.length === 0 && !hittingStats) ||
                      (hittingStats &&
                        pitchingStats &&
                        hittingGameLog.data?.length === 0 &&
                        pitchingGameLog.data?.length === 0) ? (
                        <Typography variant="body2" color="text.secondary">
                          No game log for {selectedSeason}.
                        </Typography>
                      ) : null}
                    </>
                  )}
                </Box>
              )}
            </Box>
          )}

          {!selectedSeason && hittingStats && (
            <SeasonStatsTable statItem={hittingStats} title="Hitting (by season)" statColumns={hittingColumns} />
          )}
          {!selectedSeason && pitchingStats && (
            <SeasonStatsTable statItem={pitchingStats} title="Pitching (by season)" statColumns={pitchingColumns} />
          )}
          {!selectedSeason && !hittingStats && !pitchingStats && (
            <Typography variant="body2" color="text.secondary">
              No season stats available.
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  )
}
