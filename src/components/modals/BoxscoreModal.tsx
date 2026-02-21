import CloseIcon from '@mui/icons-material/Close'
import { Box, CircularProgress, IconButton, Modal, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { lazy, Suspense } from 'react'

import { useTeams } from '@/queries/team'
import { Game } from '@/types/Game'
import { GameStatus } from '@/types/Game/GameStatus'
import type { Team } from '@/types/Team'

const GameBoxscore = lazy(() =>
  import('@/features/game/components/GameBoxscore').then((module) => ({
    default: module.GameBoxscore,
  })),
)

type BoxscoreModalProps = {
  game: Game
  onClose: () => void
}

export const BoxscoreModal = ({ game, onClose }: BoxscoreModalProps) => {
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
    <Modal
      open
      disableAutoFocus
      onClick={(e) => e.stopPropagation()}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1.5,
        boxSizing: 'border-box',
        paddingTop: 'max(12px, env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))',
      }}
    >
      <Box
        id="boxscore-modal"
        sx={{
          width: '100%',
          maxWidth: 850,
          maxHeight: '100%',
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          border: '2px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'auto',
        }}
      >
        <Box
          id="boxscore-modal-header"
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
