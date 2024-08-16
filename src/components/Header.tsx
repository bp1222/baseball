import { AppBar, Grid, Toolbar, Typography } from "@mui/material"
import SportsBaseball from "@mui/icons-material/SportsBaseball"
import TeamPicker from "./TeamPicker"
import SeasonPicker from "./SeasonPicker"

function Header() {
  return (
    <Grid container>
      <AppBar position='relative'>
        <Toolbar>
          <Grid item xs={1} alignContent={"center"}>
            <SportsBaseball
              sx={{
                mr: 2,
                display: { md: 'grid', float: "right" },
              }}
            />
          </Grid>
          <Grid item xs={1} md={4} alignContent={"center"}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                display: { xs: 'grid', md: 'none', float: "left" },
                fontWeight: 700,
                letterSpacing: '.1rem',
                textDecoration: 'none',
                overflow: 'visible'
              }}
            >
              BV
            </Typography>
            <Typography
              variant="h6"
              noWrap
              sx={{
                display: { xs: 'none', md: 'grid', float: "left" },
                fontWeight: 700,
                letterSpacing: '.1rem',
                textDecoration: 'none',
                overflow: 'visible'
              }}
            >
              Baseball Visualizer
            </Typography>
          </Grid>
          <Grid item xs={2} md={2} />
          <Grid item xs={4} md={4} alignContent={"center"}>
            <SeasonPicker />
          </Grid>
          <Grid item xs={"auto"} md={"auto"} alignContent={"center"}>
            <TeamPicker />
          </Grid>
        </Toolbar>
      </AppBar>
    </Grid>
  )
}

export default Header