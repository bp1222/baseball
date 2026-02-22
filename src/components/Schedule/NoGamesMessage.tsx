/**
 * Empty state message when no games are found for the selected date
 */

import { Box } from '@mui/material'

export const NoGamesMessage = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={0}>
      <Box component="p" margin={0} color="text.secondary">
        No games on this date.
      </Box>
    </Box>
  )
}
