import CloseIcon from '@mui/icons-material/Close'
import { Alert, Box, Button, CircularProgress, IconButton, Modal } from '@mui/material'
import { lazy, Suspense } from 'react'

import { usePerson } from '@/queries/person.ts'

const PlayerDetail = lazy(() =>
  import('@/components/Player/PlayerDetail').then((module) => ({
    default: module.PlayerDetail,
  })),
)

type PlayerModalProps = {
  personId: number
  onClose: () => void
}

const contentBoxSx = {
  width: '100%',
  maxWidth: 560,
  maxHeight: '100%',
  boxSizing: 'border-box' as const,
  bgcolor: 'background.paper',
  border: '2px solid',
  borderColor: 'divider',
  borderRadius: 2,
  overflow: 'auto' as const,
}

export const PlayerModal = ({ personId, onClose }: PlayerModalProps) => {
  const { data: person, isPending, isError, refetch } = usePerson(personId)

  if (isPending) {
    return (
      <Box
        sx={{
          ...contentBoxSx,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
        }}
      >
        <IconButton aria-label="Close" onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>
        <CircularProgress />
      </Box>
    )
  }

  if (isError || !person) {
    return (
      <Box sx={{ ...contentBoxSx, position: 'relative', p: 2 }}>
        <IconButton aria-label="Close" onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>
        <Alert severity="error">Could not load player.</Alert>
        <Button size="small" onClick={() => void refetch()} sx={{ mt: 1 }}>
          Retry
        </Button>
        <Button size="small" onClick={onClose} sx={{ mt: 1, ml: 1 }}>
          Close
        </Button>
      </Box>
    )
  }

  return (
    <Modal
      open
      disableAutoFocus
      onClick={(e) => e.stopPropagation()}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1.5,
        boxSizing: 'border-box',
        paddingTop: 'max(12px, env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 560,
          maxHeight: '100%',
          boxSizing: 'border-box',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Suspense
          fallback={
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={200}
              padding={2}
              bgcolor="background.paper"
              borderRadius={2}
              border="2px solid"
              borderColor="divider"
            >
              <CircularProgress />
            </Box>
          }
        >
          <PlayerDetail person={person} onClose={onClose} />
        </Suspense>
      </Box>
    </Modal>
  )
}
