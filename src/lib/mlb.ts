import type { Game, Team } from '@bp1222/stats-api'

/** American League (Stats API). */
export const AL_LEAGUE_ID = 103
/** National League (Stats API). */
export const NL_LEAGUE_ID = 104

const MLB_LEAGUE_IDS = new Set([AL_LEAGUE_ID, NL_LEAGUE_ID])

export function isMlbLeagueId(id: number | undefined | null): boolean {
  return id != null && MLB_LEAGUE_IDS.has(id)
}

/** True when the club belongs to the AL or NL (excludes Negro Leagues etc. under sportId 1). */
export function isMlbMajorLeagueTeam(
  team: Pick<Team, 'league'> | undefined | null,
): boolean {
  return isMlbLeagueId(team?.league?.id)
}

/** Both sides must be AL/NL — drops Negro League games and incomplete shells. */
export function isMlbMajorLeagueGame(game: Game): boolean {
  return (
    isMlbMajorLeagueTeam(game.teams.home.team) &&
    isMlbMajorLeagueTeam(game.teams.away.team)
  )
}

/** Safe short label when schedule/boxscore omit abbreviation. */
export function teamAbbr(
  team: Pick<Team, 'abbreviation' | 'teamName' | 'shortName' | 'name'> | undefined | null,
  fallback = '—',
): string {
  return team?.abbreviation ?? team?.teamName ?? team?.shortName ?? team?.name ?? fallback
}
