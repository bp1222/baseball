import type { PersonStatSplit } from '@bp1222/stats-api'

export type GameLogSplit = {
  date?: string
  opponent?: { id?: number; name?: string; abbreviation?: string }
  isHome?: boolean
  isWin?: boolean
  stat?: Record<string, unknown> & { summary?: string }
  game?: { gamePk?: number; link?: string }
}

export function GameLogSplitFromMLBPersonStatSplit(split: PersonStatSplit): GameLogSplit {
  return {
    date: split.date,
    opponent: split.opponent
      ? {
          id: split.opponent.id,
          name: split.opponent.name,
          abbreviation: split.opponent.abbreviation,
        }
      : undefined,
    isHome: split.isHome,
    isWin: split.isWin,
    stat: split.stat,
    game: split.game ? { gamePk: split.game.gamePk, link: split.game.link } : undefined,
  }
}
