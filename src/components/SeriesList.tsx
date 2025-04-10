import {Team} from "@bp1222/stats-api"
import {Grid2} from "@mui/material"

import {Series} from "@/types/Series.ts"
import dayjs from "@/utils/dayjs.ts"

import {SeriesItem} from "./SeriesList/SeriesItem.tsx"

type SeriesListProps = {
  series: Series[]
  selectedDate?: dayjs.Dayjs
  interested?: Team
}

export const SeriesList = ({series, selectedDate, interested}: SeriesListProps) => {
  return (
    <Grid2 container
           flexDirection={"row"}
           justifyContent={"center"}
           spacing={1.5}
           columns={2}
    >
      {series?.map((s) => (
        <Grid2 container
               key={s.pk}
               flexGrow={1}
               justifyContent={"center"}
               size={1}>
          <SeriesItem series={s} selectedDate={selectedDate} interested={interested}/>
        </Grid2>
      ))}
    </Grid2>
  )
}
