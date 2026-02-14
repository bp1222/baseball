import SportsBaseball from "@mui/icons-material/SportsBaseball"
import {Grid, Typography} from "@mui/material"

export const HeaderName = () => {
  return (
    <Grid container
           alignItems={"center"}
           justifyContent={"flex-start"}>
      <SportsBaseball color="secondary"/>
      <Typography variant={"h6"}
                  paddingLeft={1}
                  fontWeight={"bolder"}
                  textAlign={"left"}
                  whiteSpace={"nowrap"}>
        <Grid display={{ xs: "block", sm: "none" }}>
          Series
        </Grid>
        <Grid display={{ xs: "none", sm: "block" }}>
          Baseball Series
        </Grid>
      </Typography>
    </Grid>
  )
}