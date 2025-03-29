import SportsBaseball from "@mui/icons-material/SportsBaseball"
import {Box, Typography} from "@mui/material"

export const HeaderName = () => {
  return (
    <Box display={"flex"}
         alignItems={"center"}
         justifyContent={"flex-start"}>
      <SportsBaseball color="secondary"
                      sx={{
                        mr: .5,
                      }}/>

      <Typography variant={"h5"}
                  overflow={"visible"}
                  fontWeight={"bolder"}
                  textAlign={"left"}
                  whiteSpace={"nowrap"}>
        <Box display={{xs: "block", sm: "none"}}>
          BS
        </Box>
        <Box display={{xs: "none", sm: "block"}}>
          Baseball Series
        </Box>
      </Typography>
    </Box>
  )
}