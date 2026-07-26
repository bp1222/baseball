import type { Game, Team } from '@bp1222/stats-api'

export function parseGamesBack(value: string | undefined): number {
  if (value == null || value === '-' || value === '' || value === '0') return 0
  const n = Number.parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

export function eachDateInclusive(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  let cursor = startDate
  while (cursor <= endDate) {
    dates.push(cursor)
    const next = addDaysIso(cursor, 1)
    if (next <= cursor) break
    cursor = next
  }
  return dates
}

function addDaysIso(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00`)
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function gameDateKey(game: Game): string {
  return game.officialDate || game.gameDate.slice(0, 10)
}

function isFinal(game: Game): boolean {
  return (
    game.status.abstractGameState === 'Final' ||
    game.status.codedGameState === 'F' ||
    game.status.codedGameState === 'O'
  )
}

export type StandingTeamMeta = {
  teamId: number
  abbreviation: string
  name: string
}

export type GamesBehindDay = {
  date: string
  label: string
  byTeamId: Record<number, number>
}

/**
 * Build daily games-behind for a fixed set of teams from completed games.
 * GB uses the standard formula vs the group leader: ((LW-LL)-(W-L))/2.
 */
export function buildDailyGamesBehind(options: {
  teams: StandingTeamMeta[]
  games: Game[]
  startDate: string
  endDate: string
}): GamesBehindDay[] {
  return buildDailyDiffMetrics(options).gamesBehind
}

/**
 * Games above/below .500 = wins − losses for each team each day.
 */
export function buildDailyGamesOver500(options: {
  teams: StandingTeamMeta[]
  games: Game[]
  startDate: string
  endDate: string
}): GamesBehindDay[] {
  return buildDailyDiffMetrics(options).over500
}

export function buildDailyDiffMetrics(options: {
  teams: StandingTeamMeta[]
  games: Game[]
  startDate: string
  endDate: string
}): { gamesBehind: GamesBehindDay[]; over500: GamesBehindDay[] } {
  const { teams, games, startDate, endDate } = options
  const teamIds = new Set(teams.map((t) => t.teamId))
  const record = new Map<number, { wins: number; losses: number }>()
  for (const id of teamIds) record.set(id, { wins: 0, losses: 0 })

  const finals = games
    .filter(isFinal)
    .filter((g) => !g.isTie)
    .map((g) => ({ game: g, date: gameDateKey(g) }))
    .filter(({ date }) => date >= startDate && date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date) || a.game.gamePk - b.game.gamePk)

  const byDate = new Map<string, Game[]>()
  for (const { game, date } of finals) {
    const list = byDate.get(date)
    if (list) list.push(game)
    else byDate.set(date, [game])
  }

  const days = eachDateInclusive(startDate, endDate)
  const gamesBehind: GamesBehindDay[] = []
  const over500: GamesBehindDay[] = []

  for (const date of days) {
    for (const game of byDate.get(date) ?? []) {
      const homeId = game.teams.home.team.id
      const awayId = game.teams.away.team.id
      if (teamIds.has(homeId) && game.teams.home.isWinner) {
        record.get(homeId)!.wins += 1
      } else if (teamIds.has(homeId) && game.teams.away.isWinner) {
        record.get(homeId)!.losses += 1
      }
      if (teamIds.has(awayId) && game.teams.away.isWinner) {
        record.get(awayId)!.wins += 1
      } else if (teamIds.has(awayId) && game.teams.home.isWinner) {
        record.get(awayId)!.losses += 1
      }
    }

    let bestDiff = Number.NEGATIVE_INFINITY
    for (const id of teamIds) {
      const r = record.get(id)!
      bestDiff = Math.max(bestDiff, r.wins - r.losses)
    }

    const gbByTeam: Record<number, number> = {}
    const overByTeam: Record<number, number> = {}
    for (const id of teamIds) {
      const r = record.get(id)!
      const diff = r.wins - r.losses
      gbByTeam[id] = (bestDiff - diff) / 2
      overByTeam[id] = diff
    }

    const label = date.slice(5)
    gamesBehind.push({ date, label, byTeamId: gbByTeam })
    over500.push({ date, label, byTeamId: overByTeam })
  }

  return { gamesBehind, over500 }
}

export function teamMetaFromTeam(team: Team): StandingTeamMeta {
  return {
    teamId: team.id,
    abbreviation: team.abbreviation ?? team.teamName ?? team.name,
    name: team.name,
  }
}
