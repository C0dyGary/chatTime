import express from "express";
import "dotenv/config";

import { Server, Socket } from "socket.io";
import { createServer } from "node:http";

const PORT = process.env.PORT ?? 3000;
const app = express();

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

const midleware = (req, res, next) => {
  const { login } = req.query;
  if (login === "true") {
    next();
  } else {
    res.sendFile(process.cwd() + "/client/login.html");
  }
};

app.get("/", midleware, (req, res) => {
  res.sendFile(process.cwd() + "/client/index.html");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.static("client"));

