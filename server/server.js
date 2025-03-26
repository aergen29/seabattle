require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");

const app = express();
const httpServer = createServer(app);
const { PORT } = process.env;
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const runningRooms = [];

const createRoom = (username) => {
  let ind = runningRooms.findIndex((e) => e.userOne == username);
  if (ind == -1) {
    let roomLink = "";
    do {
      roomLink = crypto.randomBytes(3).toString("hex").toUpperCase();
    } while (runningRooms.findIndex((e) => e.room == roomLink) != -1);
    runningRooms.push({ room: roomLink, userOne: username, isReady:0 ,reads:[],shipLocations:[]});
    return roomLink;
  } else {
    return runningRooms[ind].room;
  }
};
const roomControl = (roomLink) => {
  return runningRooms.findIndex((e) => e.room == roomLink);
};

const addUserInRoom = (roomLink, username) => {
  let ind = runningRooms.findIndex((e) => e.room == roomLink);
  if (ind == -1) throw new Error("Room not founded!!");
  if(runningRooms[ind].userTwo) throw new Error("2den fazla oyuncu olamaz.");
  runningRooms[ind].userTwo = username;
  return runningRooms[ind];
};

const removeUserFromRoom = (roomLink, username) => {
  let ind = runningRooms.findIndex((e) => e.room == roomLink);
  if (ind == -1) throw new Error("The room already closed");
  if(runningRooms[ind].isReady == 2){
    runningRooms[ind].shipLocations = [];
  }
  if (runningRooms[ind].userOne == username) {
    if (!runningRooms[ind].userTwo) {
      runningRooms.splice(ind, 1);
    } else {
      runningRooms[ind].userOne = runningRooms[ind].userTwo;
      runningRooms[ind].userTwo = "";
      if (runningRooms[ind].reads.indexOf(username) != -1) {
        runningRooms[ind].reads.splice(
          runningRooms[ind].reads.indexOf(username),
          1
        );
        runningRooms[ind].isReady -= 1;
      }
      // runningRooms[ind].reads.splice(
      //   runningRooms[ind].reads.indexOf(username),
      //   1
      // );
    }
  } else if (runningRooms[ind].userTwo == username) {
    runningRooms[ind].userTwo = "";
    if (runningRooms[ind].reads.indexOf(username) != -1) {
      runningRooms[ind].reads.splice(
        runningRooms[ind].reads.indexOf(username),
        1
      );
      runningRooms[ind].isReady -= 1;
    }
  } else throw new Error("User not founded");
};

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} bağlandı`);

  socket.on("createRoom", (username, callback) => {
    callback = typeof callback == "function" ? callback : () => {};
    let roomLink = createRoom(username);
    socket.username = username;
    socket.room = roomLink;
    socket.join(roomLink);
    callback(roomLink);
  });

  socket.on("joinRoom", ({ roomLink, username }, callback) => {
    callback = typeof callback == "function" ? callback : () => {};
    try {
      socket.join(roomLink);
      socket.username = username;
      socket.room = roomLink;
      let room = addUserInRoom(roomLink, username);
      socket.join(roomLink);
      io.to(roomLink).emit("opponent", {
        usernames: [room.userOne, room.userTwo],
      });
      callback(true);
      io.to(roomLink).emit(
        "readyControl",
        room.isReady != undefined ? room.isReady : 0
      );
    } catch (e) {
      callback(e.message);
    }
  });

  socket.on("exitRoom", ({ roomLink, username }) => {
    try {
      removeUserFromRoom(roomLink, username);
      io.to(roomLink).emit("userExit", { username });
    } catch (e) {}
  });

  socket.on("roomControl", (roomLink, callback) => {
    callback = typeof callback == "function" ? callback : () => {};
    let ind = roomControl(roomLink);
    callback(ind != -1);
  });

  socket.on("ready", ({ roomLink, status, shipLocations }, callback) => {
    callback = typeof callback == "function" ? callback : () => {};
    let ind = runningRooms.findIndex((e) => e.room == roomLink);
    // runningRooms[ind].isReady = runningRooms[ind].isReady
    //   ? runningRooms[ind].isReady
    //   : 0;
    if (status) {
      runningRooms[ind].reads.push(socket.username);
      runningRooms[ind].isReady += 1;
      if (!runningRooms[ind].shipLocations)
        runningRooms[ind].shipLocations = [];
      runningRooms[ind].shipLocations = [
        ...runningRooms[ind].shipLocations,
        { username: socket.username, locations: shipLocations,shooted : 0 },
      ];
    } else {
      let readIndex = runningRooms[ind].reads.indexOf(socket.username);
      if (readIndex != -1) {
        runningRooms[ind].isReady -= 1;
        runningRooms[ind].reads.splice(readIndex, 1);
        runningRooms[ind].shipLocations = runningRooms[
          ind
        ].shipLocations.filter((e) => e.username != socket.username);
      }
    }
    runningRooms[ind].isReady = runningRooms[ind].reads.length;
    io.to(roomLink).emit("readyControl", runningRooms[ind].isReady);
    if (runningRooms[ind].isReady == 2)
      io.to(roomLink).emit("gameStarted", runningRooms[ind].userOne);
    callback(runningRooms[ind].isReady == 2);
    // io.to(roomLink).emit("readyControl", runningRooms[ind].shipLocations);
  });

  socket.on("shooting", ({ roomLink, username, coord }) => {
    let ind = runningRooms.findIndex((e) => e.room == roomLink);
    let opponentShipLocations = runningRooms[ind].shipLocations[
      runningRooms[ind].shipLocations.findIndex((e) => e.username != username)
    ];
    opponentShipLocations.shooted = opponentShipLocations.shooted?opponentShipLocations.shooted:0;
    let locations =opponentShipLocations.locations;
    let index = locations.findIndex((e) => e.x == coord.x && e.y == coord.y);
    let status = index != -1;
    if(status)
      opponentShipLocations.shooted +=1;
    
    let who = status
      ? username
      : runningRooms[ind].userOne != username
      ? runningRooms[ind].userOne
      : runningRooms[ind].userTwo;
    io.to(roomLink).emit("shooted", {
      username,
      coord,
      status,
      who,
      isGameOver:opponentShipLocations.locations.length === opponentShipLocations.shooted
    });
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      try {
        io.to(socket.room).emit("userExit", { username: socket.username });
        removeUserFromRoom(socket.room, socket.username);
      } catch (e) {}
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`App Listening on ${PORT}`);
});
