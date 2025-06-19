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

  socket.on("move", (data) => {
    console.log('data received at server mark', data.showMark);
    console.log('data received at server state', data.gameState);
    
    // Broadcast the move to all other players only once
    socket.broadcast.emit("move", data);
  });
  
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Socket.IO server running on port ${process.env.PORT}`);
});