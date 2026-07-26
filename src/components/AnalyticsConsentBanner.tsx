import { Box, Button, Stack, Typography } from '@mui/material'
import { useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import {
  getAnalyticsConsent,
  initAnalytics,
  isAnalyticsConfigured,
  setAnalyticsConsent,
  trackPageView,
  type AnalyticsConsent,
} from '../lib/analytics'

export function AnalyticsConsentBanner() {
  const path = useRouterState({
    select: (s) => `${s.location.pathname}${s.location.searchStr}`,
  })
  const [choice, setChoice] = useState<AnalyticsConsent | null>(() =>
    getAnalyticsConsent(),
  )

  if (!isAnalyticsConfigured() || choice !== null) return null

  const allow = () => {
    setAnalyticsConsent('granted')
    initAnalytics()
    trackPageView(path)
    setChoice('granted')
  }

  const decline = () => {
    setAnalyticsConsent('denied')
    setChoice('denied')
  }

  return (
    <Box
      role="dialog"
      aria-label="Analytics consent"
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (t) => t.zIndex.snackbar,
        px: { xs: 1.5, sm: 2 },
        pb: { xs: 1.5, sm: 2 },
        pt: 0,
        pointerEvents: 'none',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{
          pointerEvents: 'auto',
          maxWidth: 720,
          mx: 'auto',
          p: 1.75,
          alignItems: { sm: 'center' },
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: '0 -4px 24px rgba(20, 36, 28, 0.12)',
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
          We use optional analytics to see how people find and use Baseball Series. No
          ads. You can decline.
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          sx={{ flexShrink: 0, justifyContent: 'flex-end' }}
        >
          <Button size="small" color="inherit" onClick={decline}>
            Decline
          </Button>
          <Button size="small" variant="contained" onClick={allow}>
            Allow
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
