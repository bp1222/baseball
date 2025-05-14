import {AppBar, Grid, Toolbar} from "@mui/material"

import {HeaderName} from "./Header/HeaderName.tsx"
import {SeasonPicker} from "./Header/SeasonPicker.tsx"
import {TeamPicker} from "./Header/TeamPicker.tsx"

export const Header = () => {
  return (
    <AppBar position={"sticky"}
            sx={{marginBottom: 2}}>
      <Toolbar>
        <Grid container
               size={"grow"}>
          <Grid container
                 size={{xs: 2, sm: "grow"}}>
            <HeaderName/>
          </Grid>

          <Grid container
                 size={{xs: 3, sm: "grow"}}
                 alignContent={"center"}
                 justifyContent={"center"}>
            <SeasonPicker/>
          </Grid>

          <Grid container
                 size={"grow"}
                 justifyContent={"flex-end"}>
            <TeamPicker/>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}
