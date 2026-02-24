/**
 * Series factory — builds Series[] from raw MLB schedule data.
 */

import {
  Game as MLBGame,
  GameStatusCode as MLBGameStatusCode,
  GameTeam as MLBGameTeam,
  GameType as MLBGameType,
} from '@bp1222/stats-api'
import dayjs from 'dayjs'

import { GameFromMLBGame } from '@/types/Game'
import type { Series, SpringLeague } from '@/types/Series'
import { SeriesType } from '@/types/Series/SeriesType'
import { Team } from '@/types/Team'

/**
 * Build season series list from a flat list of MLB schedule games.
 * Filters out spring training/exhibition and postponed games; deduplicates by gamePk.
 * When teams are provided, spring training league (grapefruit/cactus) is determined from
 * the home team's springLeague abbreviation (GL = Grapefruit, CL = Cactus).
 */
export function SeriesFromMLBSchedule(schedule: MLBGame[], teams?: Team[]): Series[] {
  const teamById = teams?.length ? new Map(teams.map((t) => [t.id, t])) : undefined
  const seasonSeries: Series[] = []
  const seenGames: number[] = []

  const seriesPk = (teamA: MLBGameTeam, teamB: MLBGameTeam, seriesType: SeriesType): string => {
    return `${teamA.team.id}-${teamA.seriesNumber}-${teamB.team.id}-${teamB.seriesNumber}-${seriesType}`
  }

  function springLeagueFromAbbreviation(abbr: string | undefined): SpringLeague {
    if (abbr === 'GL') return 'grapefruit'
    if (abbr === 'CL') return 'cactus'
    return 'cactus'
  }

  const gameToSeriesType = (game: MLBGame): SeriesType => {
    switch (game.gameType) {
      case MLBGameType.Regular:
        return SeriesType.Regular
      case MLBGameType.SpringTraining:
        return SeriesType.SpringTraining
      case MLBGameType.WildCardSeries:
        return SeriesType.WildCard
      case MLBGameType.DivisionSeries:
        return SeriesType.Division
      case MLBGameType.LeagueChampionshipSeries:
        return SeriesType.League
      case MLBGameType.WorldSeries:
        return SeriesType.World
      default:
        return SeriesType.Unknown
    }
  }

  const getCurrentSeries = (game: MLBGame): Series => {
    if (game.teams == null) {
      throw new Error('Game has no teams')
    }

    const home = game.teams.home
    const away = game.teams.away
    const type = gameToSeriesType(game)

    let currentSeries = seasonSeries.find(
      (s) => s.pk === seriesPk(home, away, type) || s.pk === seriesPk(away, home, type),
    )

    if (currentSeries == null) {
      currentSeries = {
        pk: seriesPk(home, away, type),
        type: SeriesType.Unknown,
        games: [],
      }
      seasonSeries.push(currentSeries)
    }

    return currentSeries
  }

  const setSpringLeagueIfNeeded = (series: Series, game: MLBGame) => {
    if (series.type === SeriesType.SpringTraining && series.games.length === 0) {
      const homeTeamId = game.teams.home.team.id
      const abbr = teamById?.get(homeTeamId)?.springLeagueAbbreviation
      series.springLeague = springLeagueFromAbbreviation(abbr)
    }
  }

  for (const game of schedule) {
    if (game.gameType === MLBGameType.Exhibition) {
      continue
    }
    if (game.status?.codedGameState === MLBGameStatusCode.Postponed) {
      continue
    }
    if (game.gamePk != null) {
      if (seenGames.includes(game.gamePk)) continue
      seenGames.push(game.gamePk)
    }

    const currentSeries = getCurrentSeries(game)

    if (currentSeries.games.length === 0) {
      currentSeries.type = gameToSeriesType(game)
      currentSeries.startDate = dayjs(game.gameDate)
      setSpringLeagueIfNeeded(currentSeries, game)
    }
    currentSeries.endDate = dayjs(game.gameDate)
    currentSeries.games.push(GameFromMLBGame(game))
  }

  // Merge sequential series with same matchup/type (handles odd MLB data)
  return seasonSeries.reduce<Series[]>((filtered, cur) => {
    const prev = filtered.at(-1)
    if (
      prev &&
      prev.type === cur.type &&
      prev.games[0].home.teamId === cur.games[0].home.teamId &&
      prev.games[0].away.teamId === cur.games[0].away.teamId
    ) {
      prev.games = [...prev.games, ...cur.games]
      prev.games.sort((a, b) => a.gameDate.diff(b.gameDate, 'minute'))
    } else {
      filtered.push(cur)
    }
    return filtered
  }, [])
}
