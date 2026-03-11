import { Grid } from '@mui/material'
import dayjs from 'dayjs'

import { Series } from '@/types/Series'

import { SeriesItem } from './SeriesItem/SeriesItem.tsx'

type SeriesListProps = {
  series: Series[]
  selectedDate?: dayjs.Dayjs
}

export const SeriesList = ({ series, selectedDate }: SeriesListProps) => {
  return (
    <Grid
      container
      id="seriesList"
      width="100%"
      maxWidth="100%"
      minWidth={0}
      rowSpacing={1.5}
      columnSpacing={1.5}
      columns={{ xs: 1, md: 2 }}
    >
      {series?.map((s) => (
        <Grid
          container
          key={s.pk}
          size={1}
          justifyContent="center"
          flexGrow={1}
          minWidth={0}
          sx={{ position: 'relative' }}
        >
          <SeriesItem series={s} selectedDate={selectedDate} />
        </Grid>
      ))}
    </Grid>
  )
}
