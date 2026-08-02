import { createContext, type ReactNode } from 'react'

export type SeasonFocusApi = {
  setFocusDate: (date: string) => void
}

export const SeasonFocusContext = createContext<SeasonFocusApi | null>(null)

export function SeasonFocusProvider({
  value,
  children,
}: {
  value: SeasonFocusApi
  children: ReactNode
}) {
  return (
    <SeasonFocusContext.Provider value={value}>{children}</SeasonFocusContext.Provider>
  )
}
