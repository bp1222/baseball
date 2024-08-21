import { Box, Stack, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box pt={4} display={"flex"} minWidth={"100%"} justifyContent={"center"}>
      <Stack direction={"column"}>
      <Box minWidth={"20%"}>
        <Typography textAlign={"center"}>
          © {new Date().getFullYear()} Dave Walker
        </Typography>
      </Box >
      <Box minWidth={"20%"}>
        <Typography textAlign={"center"}>
          Design inspired by <a href="http://reddit.com/u/utleyscorner">/r/utleyscorner</a>
        </Typography>
      </Box >
      </Stack>
    </Box >
  );
};

export default Footer;