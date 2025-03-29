import GitHubIcon from '@mui/icons-material/GitHub'
import {Box, Stack, Typography} from "@mui/material"
import {grey} from "@mui/material/colors"
import {Link} from "react-router-dom"

import img from "/assets/c.png"

export const Footer = () => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      justifyItems={"center"}
    >
      <Box
        maxWidth={"fit-content"}
        paddingLeft={1}
        paddingTop={1}
        paddingRight={1}
        marginBottom={2}
        border={0.5}
        borderColor={grey[300]}
        borderRadius={2}
        bgcolor={grey[50]}
        mt={4}
      >
        <Stack direction={"column"}>
          <Typography align={"center"}>
            Made in <img width={12} height={12} src={img} alt={"Colorado style C"}/>olorado
          </Typography>
          <Typography paddingTop={1} align={"center"}>
            <Link to={"https://github.com/bp1222/baseball"}><GitHubIcon fontSize={"small"} sx={{color: "black"}}/></Link>
          </Typography>
        </Stack>
      </Box>
    </Box>
  )
}
