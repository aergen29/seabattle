import React, { useEffect, useState } from "react";
import socket from "../helper/socket";
import { useDispatch, useSelector } from "react-redux";
import alertify from "alertifyjs";
import { shoot } from "../redux/slices/gameSlice";
import { getAllLocations } from "../helper/valueControls";
import ClearIcon from "@mui/icons-material/Clear";
import WavesIcon from "@mui/icons-material/Waves";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const TILE_SIZE = 50;
const GRID_SIZE = 8;

const GameStartedArena = ({ first, isGameOver, setIsGameOver }) => {
  const gameState = useSelector((e) => e.game);
  const infoState = useSelector((e) => e.informations);
  const [clicked, setClicked] = useState([...Array(64).fill(false)]);
  const [isTurnMe, setIsTurnMe] = useState(first === infoState.username);
  const dispatch = useDispatch();

  useEffect(() => {
    const shooted = ({ username, coord, status, who, isGameOver }) => {
      dispatch(
        shoot({ ...coord, who: username !== infoState.username, status })
      );
      setIsTurnMe(who === infoState.username);
      if (isGameOver) {
        setIsGameOver(true);
        alertify.success(`Oyun bitti ${username} kazandı`);
      }
    };
    socket.on("shooted", shooted);
    return () => {
      socket.off("shooted", shooted);
    };
    // eslint-disable-next-line
  }, []);

  const gridOnClick = (coord) => {
    if (clicked[coord.x + coord.y * GRID_SIZE]) return;
    if (isGameOver) return;
    if (!isTurnMe) {
      alertify.error("Sıra Rakipte!!!");
      return;
    }
    let na = [...clicked];
    na[coord.x + coord.y * GRID_SIZE] = true;
    setClicked(na);
    socket.emit("shooting", {
      username: infoState.username,
      coord,
      roomLink: gameState.room,
    });
  };

  return (
    <>
      {isTurnMe ? (
        <OpponentArea
          gridOnClick={gridOnClick}
          gameState={gameState}
          infoState={infoState}
        />
      ) : (
        <MyArea gameState={gameState} infoState={infoState} />
      )}
      <Button
        color="primary"
        variant="outlined"
        sx={{ mt: 2, visibility: isGameOver ? "inherit" : "hidden" }}
        onClick={(e) => window.location.reload()}
      >
        Yeniden Başlat
      </Button>
    </>
  );
};

const MyArea = ({ gameState,infoState }) => {
  const locationState = useSelector((e) => e.locations);
  const [locations, setLocations] = useState([]);

  const xyToIndex = (e) => {
    let res = [];
    for (let i of e) {
      res.push(i.x + i.y * GRID_SIZE);
    }
    return res;
  };

  useEffect(() => {
    let loc = [...locations];
    for (let l of locationState.values) {
      loc = loc.concat(xyToIndex(getAllLocations(l)));
    }
    setLocations(Array.from(new Set([...loc])));
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div
        style={{
          width: GRID_SIZE * TILE_SIZE,
          height: GRID_SIZE * TILE_SIZE,
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
          position: "relative",
          backgroundColor: "#ddd",
          border: "4px solid black",
        }}
      >
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => (
          <div
            key={index}
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              border: "1px solid black",
              boxSizing: "border-box",
              backgroundColor:
                locations.findIndex((e) => e === index) === -1
                  ? "white"
                  : "cyan",
              transition: "all 0.1s",
              color: "black",
            }}
          >
            {gameState.myGrids.find(
              (e) =>
                e.x === index % GRID_SIZE &&
                e.y === Math.floor(index / GRID_SIZE)
            ) ? (
              gameState.myGrids.find(
                (e) =>
                  e.x === index % GRID_SIZE &&
                  e.y === Math.floor(index / GRID_SIZE)
              ).status ? (
                <DangerousIcon
                  sx={{ width: "100%", aspectRatio: "1/1", fontSize: 48 }}
                />
              ) : (
                <ClearIcon
                  sx={{ width: "100%", aspectRatio: "1/1", fontSize: 48 }}
                />
              )
            ) : infoState.username === "smyclk" &&
              gameState.opponent === "29apo29" ? (
              <FavoriteIcon
                sx={{
                  width: "100%",
                  aspectRatio: "1/1",
                  fontSize: 48,
                  color: "gray",
                }}
              />
            ) : (
              <WavesIcon
                sx={{
                  width: "100%",
                  aspectRatio: "1/1",
                  fontSize: 48,
                  color: "gray",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

const OpponentArea = ({ gameState, gridOnClick, infoState }) => {
  return (
    <>
      <div
        style={{
          width: GRID_SIZE * TILE_SIZE,
          height: GRID_SIZE * TILE_SIZE,
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
          position: "relative",
          backgroundColor: "#ddd",
          border: "4px solid black",
        }}
      >
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => (
          <div
            onClick={(e) => {
              gridOnClick({
                x: index % GRID_SIZE,
                y: Math.floor(index / GRID_SIZE),
              });
            }}
            key={index}
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              border: "1px solid black",
              boxSizing: "border-box",
              backgroundColor: "white",
              transition: "all 0.1s",
              color: "black",
              display: "flex",
            }}
          >
            {gameState.opponentGrids.find(
              (e) =>
                e.x === index % GRID_SIZE &&
                e.y === Math.floor(index / GRID_SIZE)
            ) ? (
              gameState.opponentGrids.find(
                (e) =>
                  e.x === index % GRID_SIZE &&
                  e.y === Math.floor(index / GRID_SIZE)
              ).status ? (
                <DangerousIcon
                  sx={{ width: "100%", aspectRatio: "1/1", fontSize: 48 }}
                />
              ) : (
                <ClearIcon
                  sx={{ width: "100%", aspectRatio: "1/1", fontSize: 48 }}
                />
              )
            ) : infoState.username === "smyclk" &&
              gameState.opponent === "29apo29" ? (
              <FavoriteIcon
                sx={{
                  width: "100%",
                  aspectRatio: "1/1",
                  fontSize: 48,
                  color: "gray",
                }}
              />
            ) : (
              <WavesIcon
                sx={{
                  width: "100%",
                  aspectRatio: "1/1",
                  fontSize: 48,
                  color: "gray",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default GameStartedArena;
