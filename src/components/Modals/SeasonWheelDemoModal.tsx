import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Modal } from '@mui/material'

import { PlayerSeasonWheel } from '@/components/Player'
import { useTeam } from '@/queries/team.ts'
import type { GameLogSplit } from '@/types/GameLogSplit'

type SeasonWheelDemoModalProps = {
  onClose: () => void
}

const DEMO_GAME_LOG: GameLogSplit[] = generateDemoGameLog()

const DEMO_SEASON_SPLIT = {
  season: '2024',
  stat: {
    gamesPlayed: 145,
    atBats: 550,
    runs: 95,
    hits: 157,
    doubles: 42,
    triples: 2,
    homeRuns: 30,
    rbi: 89,
    baseOnBalls: 78,
    strikeOuts: 122,
    stolenBases: 7,
    avg: '.285',
    obp: '.373',
    slg: '.525',
    ops: '.898',
  },
}

function generateDemoGameLog(): GameLogSplit[] {
  const games: GameLogSplit[] = []
  const startDate = new Date('2024-03-28')

  for (let i = 0; i < 162; i++) {
    const gameDate = new Date(startDate)
    gameDate.setDate(startDate.getDate() + Math.floor(i * 1.12))

    const didPlay = Math.random() > 0.1
    if (!didPlay) {
      games.push({
        date: gameDate.toISOString().split('T')[0],
        game: { gamePk: 700000 + i },
        stat: { atBats: 0, hits: 0 },
      })
      continue
    }

    const atBats = Math.floor(Math.random() * 3) + 2
    const rand = Math.random()

    let hits = 0
    let homeRuns = 0
    let doubles = 0
    let triples = 0
    const baseOnBalls = Math.random() > 0.85 ? 1 : 0
    let strikeOuts = 0

    if (rand < 0.05) {
      homeRuns = 1
      hits = 1 + (Math.random() > 0.7 ? 1 : 0)
    } else if (rand < 0.35) {
      hits = Math.floor(Math.random() * 3) + 1
      if (hits >= 2 && Math.random() > 0.6) doubles = 1
      if (hits >= 3 && Math.random() > 0.9) triples = 1
    } else if (rand < 0.6) {
      hits = 1
      if (Math.random() > 0.7) doubles = 1
    }

    strikeOuts = Math.min(atBats - hits, Math.floor(Math.random() * 2))

    games.push({
      date: gameDate.toISOString().split('T')[0],
      game: { gamePk: 700000 + i },
      isHome: Math.random() > 0.5,
      stat: {
        atBats,
        hits,
        homeRuns,
        doubles,
        triples,
        baseOnBalls,
        strikeOuts,
        hitByPitch: Math.random() > 0.95 ? 1 : 0,
        sacFlies: Math.random() > 0.9 ? 1 : 0,
      },
    })
  }

  return games
}

export const SeasonWheelDemoModal = ({ onClose }: SeasonWheelDemoModalProps) => {
  const { data: team } = useTeam(143)

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
    position: 'relative',
  }

  return (
    <Modal open disableAutoFocus onClose={onClose} sx={modalSx}>
      <Box sx={contentBoxSx}>
        <IconButton aria-label="Close" onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <CloseIcon />
        </IconButton>
        <PlayerSeasonWheel
          playerName="Demo Player"
          team={team}
          season="2024"
          gameLog={DEMO_GAME_LOG}
          seasonSplit={DEMO_SEASON_SPLIT}
        />
      </Box>
    </Modal>
  )
}
