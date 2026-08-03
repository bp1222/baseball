import { Box, CircularProgress, Dialog, DialogContent, Typography } from '@mui/material'
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { useScheduledGame } from '../api/queries'
import { GameDetailModal } from '../components/GameDetailModal'
import { useSeasonFocus } from '../context/useSeasonFocus'
import { validateGameDetailSearch, type GameDetailSearch } from '../lib/gameDetailSearch'
import {
  clearSeasonFocusSyncSkipIf,
  shouldSkipSeasonFocusSync,
} from '../lib/seasonFocusNav'
import { formatGameDate } from '../lib/series'

export const Route = createFileRoute('/season/$year/games/$gamePk')({
  validateSearch: (search: Record<string, unknown>): GameDetailSearch =>
    validateGameDetailSearch(search),
  component: SeasonGameModalRoute,
})

function SeasonGameModalRoute() {
  const { year, gamePk: gamePkParam } = Route.useParams()
  const { view, side } = Route.useSearch()
  const navigate = useNavigate()
  const focus = useSeasonFocus()
  const gamePk = Number(gamePkParam)
  const { game, isLoading, isError, isNotFound } = useScheduledGame(year, gamePk)

  // Latch the board-click decision once. Re-reading the module flag on every
  // effect run fails after StrictMode cleanup or when context identity changes.
  const skipFocusSyncRef = useRef<boolean | null>(null)
  if (skipFocusSyncRef.current === null) {
    skipFocusSyncRef.current = shouldSkipSeasonFocusSync(gamePk)
  }

  useEffect(() => {
    if (!game || skipFocusSyncRef.current) return
    focus?.setFocusDate(formatGameDate(game))
  }, [game, focus])

  // Deferred clear so StrictMode's immediate remount can still latch the flag.
  useEffect(() => {
    return () => {
      const pk = gamePk
      window.setTimeout(() => clearSeasonFocusSyncSkipIf(pk), 0)
    }
  }, [gamePk])

  const close = () => {
    clearSeasonFocusSyncSkipIf(gamePk)
    void navigate({ to: '/season/$year', params: { year }, resetScroll: false })
  }

  const patchSearch = (next: Partial<GameDetailSearch>) => {
    void navigate({
      from: Route.fullPath,
      search: (prev) => ({ ...prev, ...next }),
      replace: true,
    })
  }

  const openPlayer = (personId: number) => {
    void navigate({
      to: '/season/$year/games/$gamePk/players/$personId',
      params: { year, gamePk: gamePkParam, personId: String(personId) },
      search: { view, side },
      resetScroll: false,
    })
  }

  if (isLoading) {
    return (
      <Dialog open onClose={close} maxWidth="xs" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  if (isError || isNotFound || !game) {
    return (
      <Dialog open onClose={close} maxWidth="xs" fullWidth>
        <DialogContent>
          <Typography color="error" sx={{ py: 2 }}>
            Couldn’t find that game for {year}.
          </Typography>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <GameDetailModal
        game={game}
        open
        onClose={close}
        view={view}
        side={side}
        onViewChange={(next) => patchSearch({ view: next })}
        onSideChange={(next) => patchSearch({ side: next })}
        onPlayerClick={openPlayer}
      />
      <Outlet />
    </>
  )
}
