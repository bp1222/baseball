import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import type { BoxscoreTeam, Plays } from '@bp1222/stats-api'
import {
  type ScorebookOccupant,
  type ScorebookSlot,
  type ScorebookSlotStats,
  useGameScorebook,
} from '../api/scorebook'
import { ScorebookCell } from './ScorebookCell'

const CELL_W = 64
/** Default name/stat lines per batting-order slot */
const NAME_LINES = 3
const LINE_H = 22
const LABEL_W = 118
const HEADER_H = 28
const STAT_W = 28
const STAT_COLS = ['AB', 'H', 'R', 'RBI'] as const
const EMPTY_STATS: ScorebookSlotStats = { ab: 0, h: 0, r: 0, rbi: 0 }

type GameScorebookProps = {
  gamePk: number
  team: BoxscoreTeam
  side: 'away' | 'home'
  seedPlays?: Plays
}

function linesForSlot(slot: ScorebookSlot): number {
  return Math.max(NAME_LINES, slot.occupants.length)
}

function slotLineOccupants(slot: ScorebookSlot): Array<ScorebookOccupant | null> {
  const n = linesForSlot(slot)
  return Array.from({ length: n }, (_, i) => slot.occupants[i] ?? null)
}

export function GameScorebook({ gamePk, team, side, seedPlays }: GameScorebookProps) {
  const { book, isLoading, isError, hasPlays } = useGameScorebook(
    gamePk,
    team,
    side,
    true,
    seedPlays,
  )

  if (isLoading) {
    return (
      <Stack spacing={1} sx={{ alignItems: 'center', py: 4 }}>
        <CircularProgress size={28} />
        <Typography variant="caption" color="text.secondary">
          Loading scorebook…
        </Typography>
      </Stack>
    )
  }

  if (isError) {
    return (
      <Typography color="error" variant="body2" sx={{ py: 2 }}>
        Couldn’t load play-by-play for the scorebook.
      </Typography>
    )
  }

  if (!hasPlays || !book) {
    return (
      <Typography color="text.secondary" variant="body2" sx={{ py: 2 }}>
        Scorebook not available for this game.
      </Typography>
    )
  }

  const columns = book.columns
  const statsW = STAT_COLS.length * STAT_W
  const bodyRows = book.slots.reduce((sum, s) => sum + linesForSlot(s), 0)
  const gridW = LABEL_W + columns.length * CELL_W + statsW
  const gridH = HEADER_H + bodyRows * LINE_H
  const rowTracks = [
    `${HEADER_H}px`,
    ...book.slots.flatMap((s) =>
      Array.from({ length: linesForSlot(s) }, () => `${LINE_H}px`),
    ),
  ].join(' ')
  const firstStatCol = 2 + columns.length

  const slotStartRows: number[] = []
  {
    let row = 2
    for (const s of book.slots) {
      slotStartRows.push(row)
      row += linesForSlot(s)
    }
  }

  return (
    <Stack spacing={1} sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          maxHeight: 'min(560px, calc(100dvh - 300px))',
          overflow: 'auto',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.paper',
          overscrollBehavior: 'contain',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `${LABEL_W}px repeat(${columns.length}, ${CELL_W}px) repeat(${STAT_COLS.length}, ${STAT_W}px)`,
            gridTemplateRows: rowTracks,
            width: gridW,
            maxWidth: 'none',
            height: gridH,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              gridColumn: 1,
              gridRow: 1,
              position: 'sticky',
              top: 0,
              left: 0,
              zIndex: 30,
              boxSizing: 'border-box',
              borderRight: 1,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              px: 1,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem' }}>
              Batter
            </Typography>
          </Box>
          {columns.map((col, i) => (
            <Box
              key={`h-${col.id}`}
              sx={{
                gridColumn: 2 + i,
                gridRow: 1,
                position: 'sticky',
                top: 0,
                zIndex: 20,
                boxSizing: 'border-box',
                borderRight: 1,
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: col.relabeled ? 'grey.200' : 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.35,
              }}
              title={
                col.relabeled
                  ? `Inning ${col.inning} (continued into column ${col.printed})`
                  : `Inning ${col.inning}`
              }
            >
              {col.relabeled ? (
                <>
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.62rem',
                      color: 'text.secondary',
                      textDecoration: 'line-through',
                      lineHeight: 1,
                    }}
                  >
                    {col.printed}
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{ fontWeight: 800, fontSize: '0.7rem', lineHeight: 1 }}
                  >
                    {col.inning}
                  </Typography>
                </>
              ) : (
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                >
                  {col.printed}
                </Typography>
              )}
            </Box>
          ))}
          {STAT_COLS.map((label, i) => (
            <Box
              key={`h-stat-${label}`}
              sx={{
                gridColumn: firstStatCol + i,
                gridRow: 1,
                position: 'sticky',
                top: 0,
                right: (STAT_COLS.length - 1 - i) * STAT_W,
                zIndex: 30,
                boxSizing: 'border-box',
                borderLeft: i === 0 ? 2 : 1,
                borderRight: 1,
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.6rem' }}>
                {label}
              </Typography>
            </Box>
          ))}

          {book.slots.map((slot, slotIdx) => {
            const lines = slotLineOccupants(slot)
            const span = lines.length
            const slotStartRow = slotStartRows[slotIdx]!

            return (
              <Box key={`row-${slot.slot}`} sx={{ display: 'contents' }}>
                {lines.map((occ, lineIdx) => {
                  const row = slotStartRow + lineIdx
                  const isLastLine = lineIdx === span - 1
                  const lineBorderColor = isLastLine ? 'divider' : 'grey.200'
                  return (
                    <Box
                      key={`${slot.slot}-line-${lineIdx}`}
                      sx={{ display: 'contents' }}
                    >
                      <Box
                        sx={{
                          gridColumn: 1,
                          gridRow: row,
                          position: 'sticky',
                          left: 0,
                          zIndex: 10,
                          boxSizing: 'border-box',
                          borderRight: 1,
                          borderBottom: 1,
                          borderColor: 'divider',
                          borderBottomColor: lineBorderColor,
                          bgcolor: 'background.paper',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 0.75,
                          minWidth: 0,
                        }}
                        title={occ?.label}
                      >
                        {lineIdx === 0 ? (
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 800,
                              fontSize: '0.65rem',
                              color: 'text.secondary',
                              width: 12,
                              flexShrink: 0,
                            }}
                          >
                            {slot.slot}
                          </Typography>
                        ) : (
                          <Box sx={{ width: 12, flexShrink: 0 }} />
                        )}
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: occ?.isStarter ? 600 : 500,
                            fontSize: '0.6rem',
                            color: occ ? 'text.primary' : 'transparent',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            lineHeight: 1.15,
                            minWidth: 0,
                          }}
                        >
                          {occ?.label ?? '—'}
                        </Typography>
                      </Box>

                      {lineIdx === 0 &&
                        columns.map((col, i) => {
                          const pas = book.cells[col.id]?.[slot.slot] ?? []
                          return (
                            <Box
                              key={`${slot.slot}-${col.id}`}
                              sx={{
                                gridColumn: 2 + i,
                                gridRow: `${slotStartRow} / span ${span}`,
                                minWidth: 0,
                                minHeight: 0,
                                height: '100%',
                              }}
                            >
                              <ScorebookCell pas={pas} />
                            </Box>
                          )
                        })}

                      {STAT_COLS.map((key, i) => {
                        const stats = occ?.stats ?? EMPTY_STATS
                        const value = stats[key.toLowerCase() as keyof ScorebookSlotStats]
                        const show = Boolean(occ)
                        return (
                          <Box
                            key={`stat-${slot.slot}-${lineIdx}-${key}`}
                            sx={{
                              gridColumn: firstStatCol + i,
                              gridRow: row,
                              position: 'sticky',
                              right: (STAT_COLS.length - 1 - i) * STAT_W,
                              zIndex: 10,
                              boxSizing: 'border-box',
                              borderLeft: i === 0 ? 2 : 1,
                              borderRight: 1,
                              borderBottom: 1,
                              borderColor: 'divider',
                              borderBottomColor: lineBorderColor,
                              bgcolor: 'grey.50',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.65rem',
                                fontVariantNumeric: 'tabular-nums',
                                color: show ? 'text.primary' : 'transparent',
                              }}
                            >
                              {show ? value : '—'}
                            </Typography>
                          </Box>
                        )
                      })}
                    </Box>
                  )
                })}
              </Box>
            )
          })}
        </Box>
      </Box>
    </Stack>
  )
}
