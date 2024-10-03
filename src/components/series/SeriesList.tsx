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
           flexGrow={1}
           columns={2}>
        {series?.map((s) => (
          <Grid2 padding={1}
                 size={1}
                 display={"flex"}
                 flexGrow={1}
                 justifyContent={"center"}
                 key={s.pk}>
            <SeriesItem series={s} selectedDate={selectedDate} interested={interested}/>
          </Grid2>
        ))}
      </Grid2>
  )
}

export default SeriesList;