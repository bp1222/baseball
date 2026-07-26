import { Box, Stack, Typography } from '@mui/material'

type AppLogoProps = {
  size?: number
  showWordmark?: boolean
}

export function AppLogo({ size = 36, showWordmark = true }: AppLogoProps) {
  return (
    <Stack direction="row" spacing={{ xs: 1, sm: 1.25 }} sx={{ alignItems: 'center' }}>
      <Box
        component="img"
        src="/logo.svg"
        alt=""
        width={size}
        height={size}
        sx={{
          width: { xs: 32, sm: size },
          height: { xs: 32, sm: size },
          display: 'block',
          flexShrink: 0,
          borderRadius: 1,
        }}
      />
      {showWordmark && (
        <Typography
          variant="h5"
          component="div"
          sx={{
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            fontSize: { xs: '1.15rem', md: undefined },
            whiteSpace: 'nowrap',
          }}
        >
          <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
            BS
          </Box>
          <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
            Baseball Series
          </Box>
        </Typography>
      )}
    </Stack>
  )
}
