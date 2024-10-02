import { AppBar, Grid2, Toolbar } from "@mui/material";
import TeamPicker from "./TeamPicker.tsx";
import SeasonPicker from "./SeasonPicker.tsx";
import HeaderName from "./HeaderName.tsx";

const Header = () => {
  return (
    <AppBar position={"sticky"}
            sx={{marginBottom: 2}}>
      <Toolbar>
        <Grid2 container
               size={"grow"}>
          <Grid2 size={{xs: 2.5, sm: "grow"}}
                 display={"flex"}
                 alignItems={"center"}
                 justifyContent={"flex-start"}>
            <HeaderName />
          </Grid2>

          <Grid2 size={{xs: 3, sm: "grow"}}
                 display={"flex"}
                 alignContent={"center"}
                 justifyContent={{xs: "flex-start", sm: "center"}}>
            <SeasonPicker />
          </Grid2>

          <Grid2 size={"grow"}
                 display={"flex"}
                 alignItems={"center"}
                 justifyContent={"flex-end"}>
            <TeamPicker />
          </Grid2>
        </Grid2>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
