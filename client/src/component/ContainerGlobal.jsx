import React, { useEffect, useState } from "react";
import UserPaper from "./UserPaper";
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  FormControlLabel,
  FormGroup,
  styled,
  Switch,
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
import Storage from "../helper/storage";
import alertify from "alertifyjs";

const ContainerGlobal = ({ changeDarkMode, isDarkMode }) => {
  const theme = useTheme().palette;
  const [page, setPage] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const roomLink = useParams().room;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const infoState = useSelector((e) => e.informations);
  const gameState = useSelector((e) => e.game);
  const [roomLinkReady, setRoomLinkReady] = useState(false);
  const [isEmitted, setIsEmitted] = useState(false);

  useEffect(() => {
    if (gameState.isInRoom) setPage(2);
  }, [gameState]);

  useEffect(() => {
    if (roomLink && !gameState.isInRoom) {
      socket.emit("roomControl", roomLink, (res) => {
        if (res !== true) {
          alertify.error(res);
          dispatch(reset());
          navigate("/");
        } else {
          dispatch(infoSet({ name: "room", value: roomLink }));
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
    if (gameState.isInRoom) return;
    if (
      infoState.username &&
      page !== 0 &&
      !gameState.isInRoom &&
      roomLink &&
      !isEmitted
    ) {
      setIsEmitted(true);
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
          setIsEmitted(false);
        }
      );
    }
    // eslint-disable-next-line
  }, [roomLinkReady, infoState, page, isEmitted]);

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
      <FormGroup sx={{ position: "absolute", top: 20, right: 20 }}>
        <FormControlLabel
          checked={isDarkMode}
          onChange={(e) => changeDarkMode()}
          control={
            <MaterialUISwitch
              sx={{ m: 1 }}
              defaultChecked={Storage.getMode()}
            />
          }
        />
      </FormGroup>
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
              sm: "90%",
              md: "80%",
              lg: "50%",
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

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
        ...theme.applyStyles("dark", {
          backgroundColor: "#8796A5",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#001e3c",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: "#003892",
    }),
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 20 / 2,
    ...theme.applyStyles("dark", {
      backgroundColor: "#8796A5",
    }),
  },
}));

export default ContainerGlobal;
