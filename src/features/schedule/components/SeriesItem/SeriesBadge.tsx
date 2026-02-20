import { Typography, useTheme } from '@mui/material'
import { blueGrey } from '@mui/material/colors'

import { SeriesType } from '@/types/Series/SeriesType'

type SeriesBadgeProps = {
  type: SeriesType
}

export const SeriesBadge = ({ type }: SeriesBadgeProps) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  let badge = ''

  switch (type) {
    case SeriesType.WildCard:
      badge = 'Wild Card'
      break
    case SeriesType.Division:
      badge = 'Divisional'
      break
    case SeriesType.League:
      badge = 'Championship'
      break
    case SeriesType.World:
      badge = 'World Series'
      break
  }

  if (badge.length > 0) {
    return (
      <Typography
        sx={{
          maxWidth: '100%',
          width: 100,
          lineHeight: 1,
          boxSizing: 'border-box',
          color: isDark ? blueGrey[100] : blueGrey[900],
          bgcolor: isDark ? blueGrey[700] : blueGrey[300],
          borderColor: isDark ? blueGrey[500] : blueGrey[500],
        }}
        fontSize="smaller"
        textAlign="center"
        border={2}
        borderRadius={1}
        marginTop={0.5}
      >
        {badge.toUpperCase()}
      </Typography>
    )
  }
  return null
}
