const express = require("express");
require('dotenv').config()
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
let idList=[];
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust as per your React app's origin
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  idList.push(socket.id);

  // Assign marks only if there are at least two players
  let moveMark = {};
  if (idList[0]) moveMark[idList[0]] = 'X';
  if (idList[1]) moveMark[idList[1]] = 'O';

  socket.on("move", (data) => {
    console.log('id list ', idList);    
    console.log(`User ${socket.id} (${moveMark[socket.id] || 'Unknown'}) made a move:`, data);
    data.gameState[data.forId]=moveMark[socket.id]
    io.emit("move", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    idList=[];
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Socket.IO server running on port ${process.env.PORT}`);
});