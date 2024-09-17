import { AppBar, Grid, Toolbar, Typography } from "@mui/material";
import SportsBaseball from "@mui/icons-material/SportsBaseball";
import TeamPicker from "./TeamPicker";
import SeasonPicker from "./SeasonPicker";

const Header = () => {
  return (
      <Grid container>
        <AppBar
          position="relative"
          sx={{
            marginTop: 2,
            marginBottom: 2,
          }}
        >
          <Toolbar>
            <SportsBaseball
              color="secondary"
              sx={{
                mr: 1,
                display: { md: "block", float: "left" },
              }}
            />
            <Grid item xs={2} md={2}>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  display: { xs: "block", md: "none" },
                  fontWeight: 700,
                  textDecoration: "none",
                  overflow: "visible",
                }}
              >
                BS
              </Typography>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  display: { xs: "none", md: "block" },
                  fontWeight: 700,
                  textDecoration: "none",
                  overflow: "visible",
                }}
              >
                Baseball Series
              </Typography>
            </Grid>
            <Grid item xs={1} md={2} />
            <Grid
              item
              xs={3}
              md={4}
              display={"flex"}
              justifyContent={"flex-end"}
            >
              <SeasonPicker />
            </Grid>
            <Grid
              item
              xs={6}
              md={4}
              display={"flex"}
              justifyContent={"flex-end"}
            >
              <TeamPicker />
            </Grid>
          </Toolbar>
        </AppBar>
      </Grid>
  );
};

export default Header;
