import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { IconButton, Tooltip, useColorScheme } from '@mui/material'

export const Preferences = () => {
  const { mode, setMode } = useColorScheme()

  return (
    <Tooltip
      title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      enterDelay={500}
      enterNextDelay={500}
      leaveDelay={200}
    >
      <IconButton
        onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {mode === 'dark' ? (
          <Brightness7Icon color={'secondary'} aria-hidden />
        ) : (
          <Brightness4Icon color={'secondary'} aria-hidden />
        )}
      </IconButton>
    </Tooltip>
  )
}
