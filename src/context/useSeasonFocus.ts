import { useContext } from 'react'
import { SeasonFocusContext, type SeasonFocusApi } from './seasonFocusState'

export type { SeasonFocusApi }

export function useSeasonFocus(): SeasonFocusApi | null {
  return useContext(SeasonFocusContext)
}
