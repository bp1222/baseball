import { Box, CircularProgress, Dialog, DialogContent, Typography } from '@mui/material'
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useScheduledGame } from '../api/queries'
import { GameDetailModal } from '../components/GameDetailModal'
import { validateGameDetailSearch, type GameDetailSearch } from '../lib/gameDetailSearch'

export const Route = createFileRoute('/season/$year/teams/$teamId/games/$gamePk')({
  validateSearch: (search: Record<string, unknown>): GameDetailSearch =>
    validateGameDetailSearch(search),
  component: TeamGameModalRoute,
})

function TeamGameModalRoute() {
  const { year, teamId, gamePk: gamePkParam } = Route.useParams()
  const { view, side } = Route.useSearch()
  const navigate = useNavigate()
  const gamePk = Number(gamePkParam)
  const { game, isLoading, isError, isNotFound } = useScheduledGame(year, gamePk)

  const close = () => {
    void navigate({
      to: '/season/$year/teams/$teamId',
      params: { year, teamId },
      resetScroll: false,
    })
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
      to: '/season/$year/teams/$teamId/games/$gamePk/players/$personId',
      params: { year, teamId, gamePk: gamePkParam, personId: String(personId) },
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
