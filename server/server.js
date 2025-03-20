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
    runningRooms.push({ room: roomLink, userOne: username });
    // console.log(runningRooms);
    return roomLink;
  } else {
    return runningRooms[ind].room;
  }
};
const roomControl = (roomLink) => {
  // console.log("r", runningRooms);
  return runningRooms.findIndex((e) => e.room == roomLink);
};

const addUserInRoom = (roomLink, username) => {
  let ind = runningRooms.findIndex((e) => e.room == roomLink);
  if (ind == -1) throw new Error("Room not founded!!");
  runningRooms[ind].userTwo = username;
  // console.log(runningRooms[ind]);
  return runningRooms[ind];
};

const removeUserFromRoom = (roomLink, username) => {
  let ind = runningRooms.findIndex((e) => e.room == roomLink);
  if (ind == -1) throw new Error("The room already closed");
  if (runningRooms[ind].userOne == username) {
    if (!runningRooms[ind].userTwo) {
      runningRooms.splice(ind, 1);
    } else {
      runningRooms[ind].userOne = runningRooms[ind].userTwo;
      delete runningRooms[ind].userTwo;
    }
    if(runningRooms[ind].reads.indexOf(username) != -1 ){
      runningRooms[ind].reads.splice(runningRooms[ind].reads.indexOf(username),1); 
      runningRooms[ind].isReady -= 1;
    }
    runningRooms[ind].reads.splice(
      runningRooms[ind].reads.indexOf(username),
      1
    );
  } else if (runningRooms[ind].userTwo == username) {
    delete runningRooms[ind].userTwo;
    if(runningRooms[ind].reads.indexOf(username) != -1 ){
      runningRooms[ind].reads.splice(runningRooms[ind].reads.indexOf(username),1); 
      runningRooms[ind].isReady -= 1;
    }
  } else throw new Error("User not founded");
};

io.on("connection", (socket) => {
  // console.log(`Socket ${socket.id} bağlandı`);

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
      let room = addUserInRoom(roomLink, username);
      socket.join(roomLink);
      socket.username = username;
      socket.room = roomLink;
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
    // console.log("EXIT");
    try {
      removeUserFromRoom(roomLink, username);
      io.to(roomLink).emit("userExit", { username });
    } catch (e) {}
  });

  socket.on("shooting", ({ roomLink, username, coord }) => {
    io.to(roomLink).emit("shooted", {
      username,
      coord,
    });
  });

  socket.on("roomControl", (roomLink, callback) => {
    callback = typeof callback == "function" ? callback : () => {};
    let ind = roomControl(roomLink);
    callback(ind != -1);
  });

  socket.on("ready", ({ roomLink, status, shipLocations }, callback) => {
    callback = typeof callback == "function" ? callback : () => {};
    let ind = runningRooms.findIndex((e) => e.room == roomLink);
    runningRooms[ind].isReady = runningRooms[ind].isReady
      ? runningRooms[ind].isReady
      : 0;
    if (status) {
      if (runningRooms[ind].reads == undefined) runningRooms[ind].reads = [];
      runningRooms[ind].reads.push(socket.username);
      runningRooms[ind].isReady += 1;
      runningRooms[ind].shipLocations = [...shipLocations];
    } else {
      if (runningRooms[ind].reads == undefined) runningRooms[ind].reads = [];
      if (runningRooms[ind].reads.indexOf(socket.username) != -1) {
        runningRooms[ind].isReady -= 1;
        runningRooms[ind].reads.splice(
          runningRooms[ind].reads.indexOf(socket.username),
          1
        );
        runningRooms[ind].shipLocations = [];
      }
    }
    io.to(roomLink).emit("readyControl", runningRooms[ind].isReady);
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
