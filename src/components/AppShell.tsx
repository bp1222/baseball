import { ThemeProvider } from '@mui/material'
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Link as MuiLink,
  Toolbar,
} from '@mui/material'
import { Link } from '@tanstack/react-router'
import { useMemo, type ReactNode } from 'react'
import { createAppTheme } from '../theme'
import { AppFooter } from './AppFooter'
import { AppLogo } from './AppLogo'
import { SeasonTeamSelect } from './SeasonTeamSelect'

type AppShellProps = {
  children: ReactNode
  year?: string
  teamId?: number
  flatBackground?: boolean
}

export function AppShell({ children, year, teamId, flatBackground }: AppShellProps) {
  const theme = useMemo(
    () => createAppTheme(teamId, { flatBackground }),
    [teamId, flatBackground],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar
            sx={{
              gap: { xs: 1, sm: 1.5 },
              flexWrap: 'nowrap',
              py: 1,
              minHeight: { xs: 56 },
            }}
          >
            <MuiLink
              component={Link}
              to="/"
              underline="none"
              color="inherit"
              sx={{ flexShrink: 0 }}
              aria-label="Baseball Series home"
            >
              <AppLogo />
            </MuiLink>
            <SeasonTeamSelect year={year} teamId={teamId} />
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ py: 3, flex: 1 }}>
          {children}
        </Container>
        <AppFooter />
      </Box>
    </ThemeProvider>
  )
}
