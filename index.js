const { log } = require("console");
const express = require("express");
require('dotenv').config()
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust as per your React app's origin
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  let nextMove='X'; 
  let flag=1;

  socket.on("move", (data) => {
    data.showMark=nextMove;
    console.log('sending from api');
    console.log('sending nextMove', nextMove);
    
    // Broadcast the move to all other players only once
    socket.broadcast.emit("move", data);
    nextMove=='X'? 'O':'X';
    console.log('sent out and now next move', nextMove);    
    return 0;
  });
  
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Socket.IO server running on port ${process.env.PORT}`);
});