/**
 * GameItem - Renders a game tile
 *
 * This is now a simple re-export of GameTile since modal state
 * is managed centrally via ModalContext.
 */

import dayjs from 'dayjs'

import { Game } from '@/types/Game'

import { GameTile } from './GameTile'

type GameItemProps = {
  game: Game
  selectedDate?: dayjs.Dayjs
  /** 1-based game number in the series (e.g. 2 for "Game 2 of 3") */
  gameNumber?: number
  /** Total games in the series */
  gamesInSeries?: number
}

export const GameItem = ({ game, selectedDate, gameNumber, gamesInSeries }: GameItemProps) => {
  return <GameTile game={game} selectedDate={selectedDate} gameNumber={gameNumber} gamesInSeries={gamesInSeries} />
}
