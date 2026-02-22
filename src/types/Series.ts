import {
  Game as MLBGame,
  GameStatusCode as MLBGameStatusCode,
  GameTeam as MLBGameTeam,
  GameType as MLBGameType
} from '@bp1222/stats-api'
import dayjs from 'dayjs'

import {GameResult, GetGameResult} from '@/types/Game/GameResult.ts'
import {SeriesHomeAway} from '@/types/Series/SeriesHomeAway.ts'
import {SeriesResult} from '@/types/Series/SeriesResult.ts'
import {Team} from '@/types/Team.ts'

import {Game, GameFromMLBGame} from './Game'
import {SeriesType} from './Series/SeriesType'

/** Grapefruit League = Florida, Cactus League = Arizona */
export type SpringLeague = 'grapefruit' | 'cactus'

export type Series = {
  pk: string
  type: SeriesType
  games: Game[]
  startDate?: dayjs.Dayjs
  endDate?: dayjs.Dayjs

  /** Set for SpringTraining series: which league (venue location). */
  springLeague?: SpringLeague
}

/**
 * Build season series list from a flat list of MLB schedule games.
 * Filters out spring training/exhibition and postponed games; deduplicates by gamePk.
 * When teams are provided, spring training league (grapefruit/cactus) is determined from
 * the home team's springLeague. abbreviation (GL = Grapefruit, CL = Cactus).
 */
export function SeriesFromMLBSchedule(schedule: MLBGame[], teams?: Team[]): Series[] {
  const teamById = teams?.length ? new Map(teams.map((t) => [t.id, t])) : undefined
  const seasonSeries: Series[] = []
  const seenGames: number[] = []

  const seriesPk = (teamA: MLBGameTeam, teamB: MLBGameTeam, seriesType: SeriesType): string => {
    return `${teamA.team.id}-${teamA.seriesNumber}-${teamB.team.id}-${teamB.seriesNumber}-${seriesType}`
  }

  /** Map team spring league abbreviation to our SpringLeague. GL = Grapefruit, CL = Cactus. */
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

export const GetSeriesHomeAway = (series: Series, team?: Team) => {
  if (team == undefined) {
    return SeriesHomeAway.Unknown
  }

  if (series.games.length == 0) {
    return SeriesHomeAway.Unknown
  }

  let isAway = false
  let isHome = false
  series.games.forEach((game) => {
    if (game.home.teamId == team.id) {
      isHome = true
    }
    if (game.away.teamId == team.id) {
      isAway = true
    }
  })

  if (isHome && isAway) {
    return SeriesHomeAway.Split
  }

  if (isHome) {
    return SeriesHomeAway.Home
  }

  if (isAway) {
    return SeriesHomeAway.Away
  }

  return SeriesHomeAway.Unknown
}

export const GetSeriesWins = (series: Series, team: Team): number => {
  return series.games.filter(
    (game) =>
      (game.home.teamId == team.id && GetGameResult(game) == GameResult.Home) ||
      (game.away.teamId == team.id && GetGameResult(game) == GameResult.Away),
  ).length
}

export const GetSeriesLosses = (series: Series, team: Team): number => {
  return series.games.filter(
    (game) =>
      (game.home.teamId == team.id && GetGameResult(game) == GameResult.Away) ||
      (game.away.teamId == team.id && GetGameResult(game) == GameResult.Home),
  ).length
}

export const GetSeriesResult = (series: Series, team?: Team): SeriesResult => {
  if (team == undefined) {
    return SeriesResult.Unplayed
  }

  // games where home wins
  const wins = GetSeriesWins(series, team)
  const losses = GetSeriesLosses(series, team)

  if (losses != 0 || wins != 0) {
    const playedGames = losses + wins
    const gamesInSeries = series.games.length
    if (playedGames < gamesInSeries) {
      const det = Math.ceil((gamesInSeries + 1) / 2)
      return playedGames >= det
        ? wins >= det
          ? SeriesResult.Win
          : losses >= det
            ? SeriesResult.Loss
            : SeriesResult.InProgress
        : SeriesResult.InProgress
    } else {
      return losses == 0
        ? SeriesResult.Sweep
        : wins == 0
          ? SeriesResult.Swept
          : wins > losses
            ? SeriesResult.Win
            : wins == losses
              ? SeriesResult.Tie
              : SeriesResult.Loss
    }
  }

  return SeriesResult.Unplayed
}
