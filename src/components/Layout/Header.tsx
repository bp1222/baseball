import { DonutLarge } from '@mui/icons-material'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import { useParams } from '@tanstack/react-router'

import { Preferences } from '@/components/Layout/Header/Preferences.tsx'
import { useInterestedTeam } from '@/context/InterestedTeamContext'
import { useModal } from '@/context/ModalContext.tsx'

import { HeaderName } from './Header/HeaderName'
import { SeasonPicker } from './Header/SeasonPicker'
import { TeamPicker } from './Header/TeamPicker'

export const Header = () => {
  const { seasonId } = useParams({ strict: false })
  const selectedTeam = useInterestedTeam()
  const { openSeasonWheelDemo } = useModal()

  return (
    <AppBar position={'sticky'} color={'primary'} enableColorOnDark>
      <Toolbar sx={{ minWidth: 0, px: { xs: 0.5, sm: 2 } }}>
        {/* Left: app name — same flex as right so center is truly centered */}
        <Box
          sx={{
            flex: '1 1 0',
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <HeaderName />
        </Box>

        {/* Center: season picker */}
        <Box
          sx={{
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 0.5,
          }}
        >
          <SeasonPicker />
        </Box>

        {/* Right: dark mode toggle + team picker — same flex as left */}
        <Box
          sx={{
            flex: '1 1 0',
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 0.5,
          }}
        >
          <IconButton onClick={() => openSeasonWheelDemo()} color="secondary" size="large">
            <DonutLarge />
          </IconButton>
          <Preferences />
          <TeamPicker />
        </Box>
      </Toolbar>

      {seasonId && selectedTeam && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 0.5,
            px: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            component="span"
            sx={{
              opacity: 0.9,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            }}
          >
            {seasonId} • {selectedTeam.name}
          </Typography>
        </Box>
      )}
    </AppBar>
  )
}
