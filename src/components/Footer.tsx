"use client";

import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component='footer'
      sx={{
        bgcolor: "#a5a58d",
        color: "white",
        bottom: 0,
        py: 3,
        textAlign: "center",
      }}>
      <Typography sx={{ fontSize: "1rem" }}>
        © 2023 My Blog. All rights reserved.
      </Typography>
    </Box>
  );
}
