import { CssBaseline, ThemeProvider } from '@mui/material'
import { PropsWithChildren, useMemo } from 'react'

import { useInterestedTeam } from '@/context/InterestedTeamContext'
import { getTheme } from '@/theme'

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const team = useInterestedTeam()
  const theme = useMemo(() => getTheme(team?.id ?? 0), [team])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  )
}
