export type GameDetailView = 'boxscore' | 'scorebook'
export type GameDetailSide = 'away' | 'home'

export type GameDetailSearch = {
  view: GameDetailView
  side: GameDetailSide
}

export function validateGameDetailSearch(
  search: Record<string, unknown>,
): GameDetailSearch {
  return {
    view: search.view === 'scorebook' ? 'scorebook' : 'boxscore',
    side: search.side === 'home' ? 'home' : 'away',
  }
}
