import { createTheme } from "@mui/material";

const phillies = createTheme({
  palette: {
    primary: {
      main: "#6f263d",
    },
    secondary: {
      main: "#6bace4",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `linear-gradient(90deg, #e81828 3.57%, #ffffff 3.57%, #ffffff 50%, #e81828 50%, #e81828 53.57%, #ffffff 53.57%, #ffffff 100%)`,
          backgroundSize: `28px 28px`,
        },
      },
    },
  },
});

export default phillies;
