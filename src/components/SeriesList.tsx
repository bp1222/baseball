import {Team} from "@bp1222/stats-api"
import {Grid2} from "@mui/material"

import {Series} from "@/types/Series.ts"

import {SeriesItem} from "./SeriesList/SeriesItem.tsx"

type SeriesListProps = {
  series: Series[]
  interested?: Team
}

export const SeriesList = ({series, interested}: SeriesListProps) => {
  return (
    <Grid2 container
           spacing={1.5}
           columns={2}>
      {series?.map((s) => (
        <Grid2 container
               key={s.pk}
               size={1}
               justifyContent={"center"}
               flexGrow={1}>
          <SeriesItem series={s} interested={interested}/>
        </Grid2>
      ))}
    </Grid2>
  )
}
