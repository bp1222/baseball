import { useQuery } from '@tanstack/react-query'
import {
  StatGroupCode,
  StatTypes,
  type Person,
  type PersonStatSplit,
  type PersonStatsItem,
} from '@bp1222/stats-api'
import { peopleApi } from './client'

export type PlayerStatGroup = 'hitting' | 'pitching'

export type PlayerCareerBundle = {
  person: Person
  careerByGroup: Record<PlayerStatGroup, PersonStatSplit | undefined>
  seasonsByGroup: Record<PlayerStatGroup, string[]>
  /** Team ids per season from yearByYear splits (excludes season totals). */
  teamsBySeasonByGroup: Record<PlayerStatGroup, Record<string, number[]>>
  hasHitting: boolean
  hasPitching: boolean
}

const PERSON_HYDRATE =
  'currentTeam,stats(group=[hitting,pitching],type=[career,yearByYear])'

export const playerQueryKeys = {
  personCareer: (personId: number) => ['personCareer', personId] as const,
  gameLog: (personId: number, season: string, group: PlayerStatGroup) =>
    ['personGameLog', personId, season, group] as const,
}

function groupName(item: PersonStatsItem): string | undefined {
  return item.group?.displayName
}

function typeName(item: PersonStatsItem): string | undefined {
  return item.type?.displayName
}

function seasonsFromYearByYear(item: PersonStatsItem | undefined): string[] {
  const seasons = new Set<string>()
  for (const split of item?.splits ?? []) {
    if (split.season) seasons.add(split.season)
  }
  return [...seasons].sort((a, b) => b.localeCompare(a))
}

function teamsBySeasonFromYearByYear(
  item: PersonStatsItem | undefined,
): Record<string, number[]> {
  const map: Record<string, number[]> = {}
  for (const split of item?.splits ?? []) {
    const season = split.season
    const teamId = split.team?.id
    if (!season || teamId == null) continue
    const list = map[season] ?? []
    if (!list.includes(teamId)) list.push(teamId)
    map[season] = list
  }
  // yearByYear splits are chronological; newest team first for display
  for (const season of Object.keys(map)) {
    map[season].reverse()
  }
  return map
}

function careerSplit(item: PersonStatsItem | undefined): PersonStatSplit | undefined {
  return item?.splits?.[0]
}

function hasGroupData(career: PersonStatSplit | undefined, seasons: string[]): boolean {
  if (seasons.length > 0) return true
  const games = career?.stat?.gamesPlayed
  return typeof games === 'number' && games > 0
}

export function usePersonCareer(personId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: playerQueryKeys.personCareer(personId ?? 0),
    queryFn: async (): Promise<PlayerCareerBundle> => {
      const res = await peopleApi.getPerson({
        personId: personId!,
        hydrate: PERSON_HYDRATE,
      })
      const person = res.people[0]
      if (!person) throw new Error('Player not found.')

      const stats = person.stats ?? []
      const careerHitting = careerSplit(
        stats.find(
          (s) =>
            typeName(s) === StatTypes.Career && groupName(s) === StatGroupCode.Hitting,
        ),
      )
      const careerPitching = careerSplit(
        stats.find(
          (s) =>
            typeName(s) === StatTypes.Career && groupName(s) === StatGroupCode.Pitching,
        ),
      )
      const ybyHitting = stats.find(
        (s) =>
          typeName(s) === StatTypes.YearByYear && groupName(s) === StatGroupCode.Hitting,
      )
      const ybyPitching = stats.find(
        (s) =>
          typeName(s) === StatTypes.YearByYear && groupName(s) === StatGroupCode.Pitching,
      )

      const seasonsByGroup: Record<PlayerStatGroup, string[]> = {
        hitting: seasonsFromYearByYear(ybyHitting),
        pitching: seasonsFromYearByYear(ybyPitching),
      }
      const teamsBySeasonByGroup: Record<PlayerStatGroup, Record<string, number[]>> = {
        hitting: teamsBySeasonFromYearByYear(ybyHitting),
        pitching: teamsBySeasonFromYearByYear(ybyPitching),
      }
      const careerByGroup: Record<PlayerStatGroup, PersonStatSplit | undefined> = {
        hitting: careerHitting,
        pitching: careerPitching,
      }

      return {
        person,
        careerByGroup,
        seasonsByGroup,
        teamsBySeasonByGroup,
        hasHitting: hasGroupData(careerHitting, seasonsByGroup.hitting),
        hasPitching: hasGroupData(careerPitching, seasonsByGroup.pitching),
      }
    },
    enabled: enabled && personId != null && personId > 0,
    staleTime: 1000 * 60 * 30,
  })
}

export function usePersonGameLog(
  personId: number | null,
  season: string | null,
  group: PlayerStatGroup,
  enabled: boolean,
) {
  return useQuery({
    queryKey: playerQueryKeys.gameLog(personId ?? 0, season ?? '', group),
    queryFn: async (): Promise<PersonStatSplit[]> => {
      const res = await peopleApi.getPersonStats({
        personId: personId!,
        season: season!,
        stats: StatTypes.GameLog,
        group: group === 'hitting' ? StatGroupCode.Hitting : StatGroupCode.Pitching,
      })
      const item = res.stats.find((s) => groupName(s) === group) ?? res.stats[0]
      const splits = [...(item?.splits ?? [])]
      splits.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
      return splits
    },
    enabled: enabled && personId != null && personId > 0 && Boolean(season),
    staleTime: 1000 * 60 * 10,
  })
}

export function defaultStatGroup(
  person: Person | undefined,
  hasHitting: boolean,
  hasPitching: boolean,
): PlayerStatGroup {
  const isPitcher = person?.primaryPosition?.type === 'Pitcher'
  if (isPitcher && hasPitching) return 'pitching'
  if (hasHitting) return 'hitting'
  if (hasPitching) return 'pitching'
  return 'hitting'
}

export function pickDefaultSeason(
  seasons: string[],
  preferred?: string | null,
): string | null {
  if (seasons.length === 0) return null
  if (preferred && seasons.includes(preferred)) return preferred
  return seasons[0] ?? null
}
