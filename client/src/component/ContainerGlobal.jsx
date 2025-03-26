import React, { useEffect, useState } from "react";
import UserPaper from "./UserPaper";
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import RoomPaper from "./RoomPaper";
import GamePaper from "./GamePaper";
import socket from "../helper/socket";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reset, set } from "../redux/slices/gameSlice";
import { set as infoSet } from "../redux/slices/informationsSlice";

const ContainerGlobal = () => {
  const theme = useTheme().palette;
  const [page, setPage] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const roomLink = useParams().room;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const infoState = useSelector((e) => e.informations);
  const gameState = useSelector((e) => e.game);
  const [roomLinkReady, setRoomLinkReady] = useState(false);


  useEffect(() => {
    if (gameState.isInRoom) setPage(2);
  }, [gameState]);

  useEffect(() => {
    if (roomLink && !gameState.isInRoom) {
      socket.emit("roomControl", roomLink, (res) => {
        if (!res) {
          dispatch(reset());
          navigate("/");
        } else {
          dispatch(infoSet({ name: "room", value: roomLink }));
          dispatch(set({name:"room",value:roomLink}));
          setRoomLinkReady(true);
        }
      });
    }
    // eslint-disable-next-line
  }, [roomLink]);

  useEffect(() => {
    const opponentF = ({ usernames }) => {
      dispatch(
        set({
          name: "opponent",
          value:
            usernames[0] === infoState.username ? usernames[1] : usernames[0],
        })
      );
    };
    socket.on("opponent", opponentF);
    return () => {
      socket.off("opponent", opponentF);
    };
    // eslint-disable-next-line
  }, [infoState]);

  useEffect(() => {
    if (infoState.username && page !== 0 && !gameState.isInRoom && roomLink) {
      socket.emit(
        "joinRoom",
        { roomLink, username: infoState.username },
        (res) => {
          if (res !== true) {
            dispatch(reset());
            navigate("/");
          } else {
            dispatch(
              set({ name: ["room", "isInRoom"], value: [roomLink, true] })
            );
            setPage(2);
          }
        }
      );
    }
    // eslint-disable-next-line
  }, [roomLinkReady, infoState, page]);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };
    const onDisconnect = () => {
      setIsConnected(false);
    };
    const updateOnlineStatus = () => {
      setIsConnected(navigator.onLine);
    };
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

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
        overflow: "clip",
      }}
    >
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={!isConnected}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <AnimatePresence custom={page} mode="wait">
        <motion.div
          key={page}
          custom={page}
          variants={swipeVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.15 }}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            width={{
              xs: "100%",
              sm: "75%",
              md: "50%",
            }}
          >
            {page === 0 ? (
              <UserPaper swipePage={swipePage} />
            ) : page === 1 ? (
              <RoomPaper swipePage={swipePage} />
            ) : (
              <GamePaper setPage={setPage} />
            )}
          </Box>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
};
export default ContainerGlobal;
