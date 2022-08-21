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

    socket.on("updateBoard", (player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) => {
      socket.to(room).emit("receiveBoard", player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos);
    });

    socket.on("fromHome", (id, color, coin, colour, room) => {
      console.log("server called")
      socket.to(room).emit("sfromHome", id, color, coin, colour);
    });

    socket.on("setNull", (row, col, room) => {
      socket.to(room).emit("s_setNull", row, col);
    });  

    socket.on("pos2", (pos_0, pos_1, colour, coin, room) => {
      socket.to(room).emit("s_pos2", pos_0, pos_1, colour, coin);
    }); 

    socket.on("pos3", (coinId, room) => {
      socket.to(room).emit("s_pos3", coinId);
    });  

    socket.on("Notpos3", (pos_0, pos_1, colour, coin, room) => {
      socket.to(room).emit("s_Notpos3", pos_0, pos_1, colour, coin);
    });  

    socket.on("updatePlayers", (players, room) => {
      socket.to(room).emit("s_updatePlayers", players);
    });  

  });
  
  server.listen(3001, () => {
    console.log("SERVER IS RUNNING...");
  });
