import {Grid} from "@mui/material"
import dayjs from "dayjs"

import {Series} from "@/types/Series.ts"

import {SeriesItem} from "./SeriesList/SeriesItem.tsx"

type SeriesListProps = {
  series: Series[]
  selectedDate?: dayjs.Dayjs
}

export const SeriesList = ({series, selectedDate}: SeriesListProps) => {
  return (
    <Grid container
           spacing={1.5}
           columns={2}>
      {series?.map((s) => (
        <Grid container
               key={s.pk}
               size={1}
               justifyContent={"center"}
               flexGrow={1}>
          <SeriesItem series={s} selectedDate={selectedDate}/>
        </Grid>
      ))}
    </Grid>
  )
}
