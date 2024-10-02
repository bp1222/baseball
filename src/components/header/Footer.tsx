import { Box, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import GitHubIcon from '@mui/icons-material/GitHub';

import img from "../../assets/c.png";
import {Link} from "react-router-dom";

const Footer = () => {
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
          <Typography textAlign={"center"}>
            Made in <img width={12} height={12} src={img} />olorado
          </Typography>
          <Typography paddingTop={1} align={"center"}>
            <Link to={"https://github.com/bp1222/baseball"}><GitHubIcon fontSize={"small"} sx={{color: "black"}}/></Link>
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
