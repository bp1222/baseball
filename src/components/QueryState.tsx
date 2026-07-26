import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type QueryStateProps = {
  isLoading: boolean
  isError: boolean
  error?: Error | null
  isEmpty?: boolean
  emptyMessage?: string
  children: ReactNode
}

export function QueryState({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyMessage = 'Nothing to show.',
  children,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return <Alert severity="error">{error?.message ?? 'Failed to load data.'}</Alert>
  }

  if (isEmpty) {
    return (
      <Stack sx={{ alignItems: 'center', py: 4 }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Stack>
    )
  }

  return <>{children}</>
}
