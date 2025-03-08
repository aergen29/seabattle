import React, { useState } from "react";
import UserPaper from "./UserPaper";
import { Box, Container, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import RoomPaper from "./RoomPaper";
import GamePaper from "./GamePaper";

const ContainerGlobal = () => {
  const theme = useTheme().palette;
  const [page, setPage] = useState(0);
  const swipeVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  const swipePage = (newPage) => {
    setPage((prevPage) => (newPage > prevPage ? prevPage + 1 : prevPage - 1));
  };
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
        overflow: "clip"

      }}
    >
      <AnimatePresence custom={page} mode="wait">
        <motion.div
          key={page}
          custom={page}
          variants={swipeVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.15 }}
          style={{width: "100%", display:"flex", justifyContent:"center", alignItems:"center" }}
        >
          <Box
            width={{
              xs: "100%",
              sm: "75%",
              md: "50%",
            }}
          >
            {/* {page == 0 ? (
              <UserPaper swipePage={swipePage} />
            ) : (
              <RoomPaper swipePage={swipePage} />
            )} */}
            <GamePaper/>
          </Box>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
};
export default ContainerGlobal;
