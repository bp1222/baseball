/**
 * Combined theme provider: owns light/dark mode state (persisted to localStorage)
 * and wraps children in MUI's ThemeProvider with the correct team + mode theme.
 */

import {CssBaseline, type PaletteMode, ThemeProvider} from '@mui/material'
import {createContext, PropsWithChildren, useCallback, useContext, useMemo, useState} from 'react'

import {useInterestedTeam} from '@/context/InterestedTeamContext'
import {GetTeamTheme} from '@/theme'

const STORAGE_KEY = 'themeMode'

type ThemeModeContextValue = {
  mode: PaletteMode
  setMode: (mode: PaletteMode) => void
  toggleMode: () => void
}

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'light',
  setMode: () => {},
  toggleMode: () => {},
})

function readStoredMode(): PaletteMode {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return 'light'
}

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const [mode, setModeState] = useState<PaletteMode>(readStoredMode)
  const team = useInterestedTeam()

  const setMode = useCallback((next: PaletteMode) => {
    setModeState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  const value = useMemo(() => ({ mode, setMode, toggleMode }), [mode, setMode, toggleMode])
  const theme = useMemo(() => GetTeamTheme(team?.id ?? 0, mode), [team, mode])

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}

export const useThemeMode = () => {
  const ctx = useContext(ThemeModeContext)
  if (ctx == null) {
    throw new Error('useThemeMode must be used within AppThemeProvider')
  }
  return ctx
}
