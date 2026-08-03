import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  GameType,
  StandingsTypeCode,
  type DivisionStandings,
  type Game,
  type Linescore,
  type Season,
  type Team,
} from '@bp1222/stats-api'
import {
  COMPETITIVE_GAME_TYPES,
  MLB_SPORT_ID,
  referenceApi,
  scheduleApi,
  standingsApi,
} from './client'
import { isMlbMajorLeagueGame, isMlbMajorLeagueTeam } from '../lib/mlb'
import { findGameInSeriesList } from '../lib/findGame'
import {
  addDays,
  gameDatesFromSeries,
  groupGamesIntoSeries,
  localToday,
  seriesForFocusDate,
  type Series,
} from '../lib/series'
import { buildDailyDiffMetrics } from '../lib/standings'

const SEASON_SCHEDULE_STALE_TIME = 1000 * 60 * 60 * 24
const LINESCORE_REFETCH_MS = 1000 * 60

export const queryKeys = {
  seasons: ['seasons'] as const,
  teams: (year: string) => ['teams', year, 'alNl'] as const,
  team: (year: string, teamId: number) => ['team', year, teamId] as const,
  seasonSchedule: (year: string) =>
    ['seasonSchedule', year, 'alNl', 'linescore'] as const,
  standings: (year: string, leagueId: number) => ['standings', year, leagueId] as const,
  season: (year: string) => ['season', year] as const,
  dailyLinescores: (date: string) =>
    ['dailyLinescores', date, 'alNl', 'linescore'] as const,
}

function flattenScheduleGames(dates: { games: Game[] }[] | undefined): Game[] {
  if (!dates) return []
  return dates.flatMap((d) => d.games ?? []).filter(isMlbMajorLeagueGame)
}

function seasonBounds(season: Season | undefined, year: string) {
  const start =
    season?.regularSeasonStartDate ?? season?.springStartDate ?? `${year}-03-01`
  const end = season?.postSeasonEndDate ?? season?.regularSeasonEndDate ?? `${year}-11-15`
  return { start, end }
}

export function useSeasons() {
  return useQuery({
    queryKey: queryKeys.seasons,
    queryFn: async (): Promise<Season[]> => {
      const res = await referenceApi.getAllSeasons({ sportId: MLB_SPORT_ID })
      return [...(res.seasons ?? [])].sort((a, b) => b.seasonId.localeCompare(a.seasonId))
    },
    staleTime: 1000 * 60 * 60,
  })
}

export type DailyLinescoreEntry = {
  game: Game
  linescore?: Linescore
}

/**
 * Day schedule with linescores for in-progress games. Shared across GameBoxes;
 * polls every minute for today / yesterday (late games).
 */
export function useDailyLinescores(date: string, enabled = true) {
  const today = localToday()
  const shouldPoll = date === today || date === addDays(today, -1)

  return useQuery({
    queryKey: queryKeys.dailyLinescores(date),
    queryFn: async (): Promise<Map<number, DailyLinescoreEntry>> => {
      const res = await scheduleApi.getSchedule({
        sportId: MLB_SPORT_ID,
        startDate: date,
        endDate: date,
        gameTypes: COMPETITIVE_GAME_TYPES,
        hydrate: 'league,team,linescore',
      })
      const games = flattenScheduleGames(res.dates)
      const map = new Map<number, DailyLinescoreEntry>()

      for (const game of games) {
        map.set(game.gamePk, { game, linescore: game.linescore })
      }

      return map
    },
    enabled: Boolean(date) && enabled,
    staleTime: 20_000,
    refetchInterval: shouldPoll ? LINESCORE_REFETCH_MS : false,
  })
}

/** Live linescore + fresh schedule row for one game (via shared daily query). */
export function useGameLinescore(gamePk: number, gameDate: string) {
  const today = localToday()
  const enabled = gameDate === today || gameDate === addDays(today, -1)
  const daily = useDailyLinescores(gameDate, enabled)

  return useMemo(() => {
    const entry = daily.data?.get(gamePk)
    return {
      ...daily,
      linescore: entry?.linescore,
      liveGame: entry?.game,
      enabled,
    }
  }, [daily, gamePk, enabled])
}

export function useSeason(year: string) {
  return useQuery({
    queryKey: queryKeys.season(year),
    queryFn: async (): Promise<Season | undefined> => {
      const res = await referenceApi.getSeasonById({
        seasonId: year,
        sportId: MLB_SPORT_ID,
      })
      return res.seasons?.[0]
    },
    enabled: Boolean(year),
    staleTime: 1000 * 60 * 60,
  })
}

export function useSeasonTeams(year: string) {
  return useQuery({
    queryKey: queryKeys.teams(year),
    queryFn: async (): Promise<Team[]> => {
      const res = await referenceApi.getTeams({
        season: year,
        sportId: MLB_SPORT_ID,
        hydrate: 'league,division',
      })
      return [...(res.teams ?? [])]
        .filter(isMlbMajorLeagueTeam)
        .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
    },
    enabled: Boolean(year),
    staleTime: 1000 * 60 * 30,
  })
}

export function useTeam(year: string, teamId: number) {
  return useQuery({
    queryKey: queryKeys.team(year, teamId),
    queryFn: async (): Promise<Team | undefined> => {
      const res = await referenceApi.getTeam({
        teamId,
        season: year,
        hydrate: 'division',
      })
      return res.teams?.[0]
    },
    enabled: Boolean(year) && teamId > 0,
    staleTime: 1000 * 60 * 30,
  })
}

/** Full-season schedule grouped into series. Shared by landing + team views. */
export function useSeasonSchedule(year: string) {
  const seasonQuery = useSeason(year)

  return useQuery({
    queryKey: queryKeys.seasonSchedule(year),
    queryFn: async (): Promise<Series[]> => {
      const { start, end } = seasonBounds(seasonQuery.data, year)
      const schedule = await scheduleApi.getSchedule({
        sportId: MLB_SPORT_ID,
        startDate: start,
        endDate: end,
        gameTypes: COMPETITIVE_GAME_TYPES,
        hydrate: 'league,team,linescore',
      })
      return groupGamesIntoSeries(flattenScheduleGames(schedule.dates))
    },
    enabled: Boolean(year) && seasonQuery.isSuccess,
    staleTime: SEASON_SCHEDULE_STALE_TIME,
  })
}

/** Resolve a Game from the season schedule cache by gamePk. */
export function useScheduledGame(year: string, gamePk: number) {
  const scheduleQuery = useSeasonSchedule(year)
  const game = useMemo(
    () => findGameInSeriesList(scheduleQuery.data, gamePk),
    [scheduleQuery.data, gamePk],
  )
  return {
    game,
    isLoading: scheduleQuery.isLoading || scheduleQuery.isPending,
    isError: scheduleQuery.isError,
    error: scheduleQuery.error,
    isNotFound: scheduleQuery.isSuccess && game == null,
  }
}

export function useSeriesForDate(focusDate: string) {
  const year = focusDate.slice(0, 4)
  const scheduleQuery = useSeasonSchedule(year)

  const derived = useMemo(() => {
    const series = scheduleQuery.data ?? []
    const { playing, offday } = seriesForFocusDate(series, focusDate)
    return {
      playing,
      offday,
      gameDates: gameDatesFromSeries(series),
    }
  }, [scheduleQuery.data, focusDate])

  return {
    ...scheduleQuery,
    data: scheduleQuery.data ? derived : undefined,
  }
}

export function useTeamSeries(year: string, teamId: number) {
  const scheduleQuery = useSeasonSchedule(year)

  const series = useMemo(() => {
    if (!scheduleQuery.data) return undefined
    return scheduleQuery.data.filter(
      (s) => s.homeTeam.id === teamId || s.awayTeam.id === teamId,
    )
  }, [scheduleQuery.data, teamId])

  return {
    ...scheduleQuery,
    data: series,
  }
}

export function useStandings(year: string, leagueId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.standings(year, leagueId ?? 0),
    queryFn: async (): Promise<DivisionStandings[]> => {
      const res = await standingsApi.getStandings({
        leagueId: leagueId!,
        season: year,
        standingsTypes: StandingsTypeCode.RegularSeason,
        hydrate: 'division',
      })
      return res.records ?? []
    },
    enabled: Boolean(year) && Boolean(leagueId),
    staleTime: 1000 * 60 * 30,
  })
}

export type GamesBehindTeamMeta = {
  teamId: number
  abbreviation: string
  name: string
  /** MLB standings clinch letter (w/x/y/z) when the team has clinched. */
  clinchIndicator?: string
  clinched?: boolean
}

export type GamesBehindHistoryPoint = {
  date: string
  label: string
  byTeamId: Record<number, number>
}

export type GamesBehindHistory = {
  teams: GamesBehindTeamMeta[]
  points: GamesBehindHistoryPoint[]
  over500Points: GamesBehindHistoryPoint[]
  scope: 'division' | 'league'
}

export function useGamesBehindHistory(options: {
  year: string
  leagueId: number | undefined
  divisionId?: number
  startDate?: string
  endDate?: string
}) {
  const { year, leagueId, divisionId, startDate, endDate } = options
  const scope = divisionId != null ? 'division' : 'league'
  const scheduleQuery = useSeasonSchedule(year)

  return useQuery({
    queryKey: [
      'gamesBehindHistory',
      year,
      leagueId ?? 0,
      divisionId ?? 'league',
      startDate,
      endDate,
    ] as const,
    queryFn: async (): Promise<GamesBehindHistory> => {
      const start = startDate ?? `${year}-03-28`
      const end = endDate ?? localToday()
      const cappedEnd = end > localToday() ? localToday() : end

      const standings = await standingsApi.getStandings({
        leagueId: leagueId!,
        season: year,
        standingsTypes: StandingsTypeCode.RegularSeason,
        hydrate: 'division,team',
      })

      const blocks =
        divisionId != null
          ? (standings.records ?? []).filter((r) => r.division?.id === divisionId)
          : (standings.records ?? [])

      const teamMap = new Map<number, GamesBehindTeamMeta>()
      for (const block of blocks) {
        for (const row of block.teamRecords ?? []) {
          teamMap.set(row.team.id, {
            teamId: row.team.id,
            abbreviation:
              row.team.abbreviation ??
              row.team.teamName ??
              row.team.name ??
              String(row.team.id),
            name: row.team.name ?? String(row.team.id),
            clinchIndicator: row.clinchIndicator,
            clinched: row.clinched,
          })
        }
      }

      const teams = [...teamMap.values()].sort((a, b) =>
        a.abbreviation.localeCompare(b.abbreviation),
      )

      const teamIds = new Set(teams.map((t) => t.teamId))
      const games = (scheduleQuery.data ?? []).flatMap((s) =>
        s.games.filter(
          (g) =>
            g.gameType === GameType.Regular &&
            (teamIds.has(g.teams.home.team.id) || teamIds.has(g.teams.away.team.id)),
        ),
      )

      const { gamesBehind, over500 } = buildDailyDiffMetrics({
        teams,
        games,
        startDate: start,
        endDate: cappedEnd,
      })

      return {
        teams,
        points: gamesBehind,
        over500Points: over500,
        scope,
      }
    },
    enabled:
      Boolean(year) &&
      Boolean(leagueId) &&
      Boolean(startDate) &&
      Boolean(endDate) &&
      scheduleQuery.isSuccess,
    staleTime: 1000 * 60 * 30,
  })
}
