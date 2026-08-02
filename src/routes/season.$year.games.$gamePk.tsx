import { Box, CircularProgress, Dialog, DialogContent, Typography } from '@mui/material'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useScheduledGame } from '../api/queries'
import { GameDetailModal } from '../components/GameDetailModal'
import { useSeasonFocus } from '../context/useSeasonFocus'
import { validateGameDetailSearch, type GameDetailSearch } from '../lib/gameDetailSearch'
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

  useEffect(() => {
    if (game) focus?.setFocusDate(formatGameDate(game))
  }, [game, focus])

  const close = () => {
    void navigate({ to: '/season/$year', params: { year } })
  }

  const patchSearch = (next: Partial<GameDetailSearch>) => {
    void navigate({
      from: Route.fullPath,
      search: (prev) => ({ ...prev, ...next }),
      replace: true,
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
    <GameDetailModal
      game={game}
      open
      onClose={close}
      view={view}
      side={side}
      onViewChange={(next) => patchSearch({ view: next })}
      onSideChange={(next) => patchSearch({ side: next })}
    />
  )
}
