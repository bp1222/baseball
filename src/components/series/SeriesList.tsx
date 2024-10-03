import {Grid2} from "@mui/material";
import SeriesItem from "./SeriesItem.tsx";
import {Series} from "../../models/Series.ts";
import dayjs from "../../utils/dayjs.ts";
import {Team} from "@bp1222/stats-api";

type SeriesListProps = {
  series: Series[]
  selectedDate?: dayjs.Dayjs
  interested?: Team
}

const SeriesList = ({series, selectedDate, interested}: SeriesListProps) => {
  return (
    <Grid2 container
           justifyContent={"center"}
           columns={2}>
      {series?.map((s) => (
        <Grid2 size={1}
               display={"flex"}
               justifyContent={"center"}
               padding={1}>
          <SeriesItem key={s.pk} series={s} selectedDate={selectedDate} interested={interested}/>
        </Grid2>
      ))}
    </Grid2>
  )
}

export default SeriesList;