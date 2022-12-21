const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { urlForClient } = require("./link");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: "http://192.168.29.43:3000",
    origin : urlForClient,
    // origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.join("122");

  // socket.on("")

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
  function convert(fn, length) {function convert(fn, length) {
    return fn(length);
}
    return fn(length);
}
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });

  socket.on("update_code", (data) => {
    // console.log("\n\n 🚀 ~ file: index.js:37 ~ socket.on ~ data", data);
    socket.to("122").emit("recieveCode", data);
  });
});

server.listen(4001, () => {
  console.log("SERVER RUNNING");
});
