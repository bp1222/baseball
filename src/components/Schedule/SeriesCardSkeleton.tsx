import { Grid, Skeleton } from '@mui/material'

export const SeriesCardSkeleton = () => (
  <Grid
    container
    border={1}
    borderRadius={1}
    borderColor="divider"
    bgcolor="action.hover"
    flexWrap="nowrap"
    sx={{ width: '100%', maxWidth: { xs: '100%', sm: '35em' }, minWidth: 0, flexGrow: 1 }}
  >
    <Grid alignContent="center" minWidth={120} maxWidth={120} sx={{ flexShrink: 0 }}>
      <Grid container paddingTop={1} paddingBottom={1} justifyContent="center">
        <Grid>
          <Skeleton variant="text" width={80} height={24} sx={{ mx: 'auto' }} />
          <Skeleton variant="text" width={60} height={20} sx={{ mx: 'auto', mt: 0.5 }} />
        </Grid>
        <Grid paddingTop={1}>
          <Skeleton variant="rounded" width={64} height={20} sx={{ mx: 'auto' }} />
        </Grid>
        <Grid paddingTop={0.5}>
          <Skeleton variant="text" width={70} height={16} sx={{ mx: 'auto' }} />
        </Grid>
      </Grid>
    </Grid>
    <Grid flexGrow={1} minWidth={0} justifyContent="flex-end" alignContent="center">
      <Grid container justifyContent="flex-end" gap={0.5} flexWrap="wrap">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" width={60} height={44} sx={{ minWidth: 60 }} />
        ))}
      </Grid>
    </Grid>
  </Grid>
)
