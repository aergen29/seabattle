import React, { useEffect, useState } from "react";
import UserPaper from "./UserPaper";
import { Box, Container, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import RoomPaper from "./RoomPaper";
import GamePaper from "./GamePaper";
import socket from "../helper/socket";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Storage  from '../helper/storage';
import { reset, set } from "../redux/slices/gameSlice";
import {set as infoSet} from "../redux/slices/informationsSlice";

const ContainerGlobal = () => {
  const theme = useTheme().palette;
  const [page, setPage] = useState(0);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const roomLink = useParams().room;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const infoState = useSelector(e=>e.informations);
  const gameState = useSelector(e=>e.game);
  const [roomLinkReady,setRoomLinkReady] = useState(false);

  useEffect(()=>{
    if(gameState.isInRoom) setPage(2);
  },[gameState])

  useEffect(()=>{
    if(roomLink && !gameState.isInRoom){
      socket.emit("roomControl",roomLink,(res)=>{
        if(!res){
          dispatch(reset())
          navigate("/");
        }else{
          dispatch(infoSet({name:"room",value:roomLink}))
          setRoomLinkReady(true);}
      })
    }
  },[roomLink]);

  useEffect(()=>{
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
  },[infoState])

  useEffect(()=>{
    if(infoState.username && page != 0 && !gameState.isInRoom){
      socket.emit("joinRoom",{roomLink,username:infoState.username},(res)=>{
        if(res != true){
          dispatch(reset())
          navigate("/");        
        }
        else{
          dispatch(set({name:["room","isInRoom"],value:[roomLink,true]}));
          setPage(2);
        }
      })

    }
  },[roomLinkReady,infoState,page])
  

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };
    socket.on("connect", onConnect);
    return () => {
      socket.off("connect", onConnect);
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
            {page == 0 ? (
              <UserPaper swipePage={swipePage} />
            ) : page == 1 ? (
              <RoomPaper swipePage={swipePage} />
            ) : (
              <GamePaper />
            )}
          </Box>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
};
export default ContainerGlobal;
