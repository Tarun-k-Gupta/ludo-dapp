const express = require("express");
const app = express();

const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("join_room", (room_code) => {
      socket.join(room_code);
    });
  
    socket.on("send_message", (data) => {
      socket.to(data.room_code).emit("receive_message", data);
    });

    socket.on("updateBoard", (player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) => {
      socket.to(room).emit("receiveBoard", player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos);
    })
  });
  
  server.listen(3001, () => {
    console.log("SERVER IS RUNNING...");
  });