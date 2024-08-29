import { Box, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

import img from "../assets/c.png";

const Footer = () => {
  return (
    <Box width={"100%"} display={"flex"} justifyContent={"center"}>
      <Box
        padding={0.5}
        marginBottom={2}
        border={0.5}
        borderColor={grey[300]}
        borderRadius={2}
        bgcolor={grey[50]}
        mt={4}
        width={"fit-content"}
      >
        <Stack direction={"column"}>
          <Box minWidth={"20%"}>
            <Typography textAlign={"center"}>
              © {new Date().getFullYear()}
            </Typography>
            <Typography textAlign={"center"}>
              Made in <img width={12} height={12} src={img} />
              olorado
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
