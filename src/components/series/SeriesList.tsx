import {Team} from "@bp1222/stats-api"
import {Grid2} from "@mui/material"

import {Series} from "../../models/Series.ts"
import dayjs from "../../utils/dayjs.ts"
import SeriesItem from "./SeriesItem.tsx"

type SeriesListProps = {
  series: Series[]
  selectedDate?: dayjs.Dayjs
  interested?: Team
}

const SeriesList = ({series, selectedDate, interested}: SeriesListProps) => {
  return (
    <Grid2 container
           flexDirection={"row"}
           justifyContent={"center"}
           spacing={1.5}
           columns={2}>
      {series?.map((s) => (
        <Grid2 display={"flex"}
               key={s.pk}
               justifyContent={"center"}
               size={1}>
            <SeriesItem series={s} selectedDate={selectedDate} interested={interested}/>
        </Grid2>
      ))}
    </Grid2>
  )
}

export default SeriesList