import { Grid, Skeleton } from '@mui/material'

import LabelPaper from '@/components/Shared/LabelPaper'

export const SeriesRecordSkeleton = () => (
  <LabelPaper label="Series Record">
    <Grid container flexDirection="column">
      <Grid container flexDirection="row" justifyContent="center" textAlign="center" columns={3}>
        <Grid size={1}>
          <Skeleton variant="text" width={48} height={48} sx={{ mx: 'auto' }} />
        </Grid>
        <Grid size={1}>
          <Skeleton variant="text" width={48} height={48} sx={{ mx: 'auto' }} />
        </Grid>
        <Grid size={1}>
          <Skeleton variant="text" width={48} height={48} sx={{ mx: 'auto' }} />
        </Grid>
      </Grid>
      <Grid container flexDirection="row" justifyContent="center" textAlign="center" columns={3}>
        <Grid size={1}>
          <Skeleton variant="text" width={72} height={16} sx={{ mx: 'auto' }} />
        </Grid>
        <Grid size={1}>
          <Skeleton variant="text" width={80} height={16} sx={{ mx: 'auto' }} />
        </Grid>
        <Grid size={1}>
          <Skeleton variant="text" width={72} height={16} sx={{ mx: 'auto' }} />
        </Grid>
      </Grid>
      <Grid container justifyContent="center" paddingTop={1} paddingBottom={1}>
        <Skeleton variant="text" width={180} height={20} />
      </Grid>
    </Grid>
  </LabelPaper>
)
