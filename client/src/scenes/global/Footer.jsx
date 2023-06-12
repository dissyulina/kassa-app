import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import { shades } from "../../theme";

function Footer() {
  const {
    palette: { neutral },
  } = useTheme();
  return (
    <Box marginTop="70px" padding="40px 0" backgroundColor={'lightgray'}>
      <Box
        width="80%"
        margin="auto"
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        rowGap="30px"
        columnGap="clamp(20px, 30px, 40px)"
      >
        <Box width="clamp(20%, 30%, 40%)">
          <Typography
            variant="h4"
            fontWeight="bold"
            mb="30px"
            color={shades.secondary[500]}
          >
            BAZAAR GKIN RWDH
          </Typography>
        </Box>
        <Box width="clamp(20%, 25%, 30%)">
          <Typography mb="30px">
            Jan Luykenlaan 92, Den Haag
          </Typography>
          <Typography mb="30px" sx={{ wordWrap: "break-word" }}>
            dissyulina@gmail.com
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;