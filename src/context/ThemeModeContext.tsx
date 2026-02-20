/**
 * Theme mode (light/dark) with persistence to localStorage.
 */

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'themeMode'

export type ThemeMode = 'light' | 'dark'

type ThemeModeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'light',
  setMode: () => {},
  toggleMode: () => {},
})

function readStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return 'light'
}

type ThemeModeProviderProps = {
  children: ReactNode
}

export const ThemeModeProvider = ({ children }: ThemeModeProviderProps) => {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode)

  const setMode = useCallback((next: ThemeMode) => {
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

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
}

export const useThemeMode = (): ThemeModeContextValue => {
  const ctx = useContext(ThemeModeContext)
  if (ctx == null) {
    throw new Error('useThemeMode must be used within ThemeModeProvider')
  }
  return ctx
}
