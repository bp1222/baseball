export type GameLogSplit = {
  date?: string
  opponent?: { id?: number; name?: string; abbreviation?: string }
  isHome?: boolean
  isWin?: boolean
  stat?: Record<string, unknown> & { summary?: string }
  game?: { gamePk?: number; link?: string }
}
