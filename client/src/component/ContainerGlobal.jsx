import React from "react";
import RoomPaper from "./RoomPaper";
import { Box, Container, useTheme } from "@mui/material";

const ContainerGlobal = () => {
  const theme = useTheme().palette;
  console.log(theme)
  return (
    <Container
      sx={{
        width: "100%",
        maxWidth: "100% !important",
        minHeight: "100vh",
        m: 0,
        p: 0,
        bgcolor: theme.background.main,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        width={{
          xs: "100%",
          sm:"75%",
          md: "50%",
        }}
      >
        <RoomPaper />
      </Box>
    </Container>
  );
};

export default ContainerGlobal;
