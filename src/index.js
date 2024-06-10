import express from "express";
import "dotenv/config";

import { Server, Socket } from "socket.io";
import { createServer } from "node:http";

const PORT = process.env.PORT ?? 3000;
const app = express();
app.use(express.json());

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
  try {
  const users = 
    [{"username": "admin", "password": "admin"},
    {"username": "user1", "password": "user1"},
    {"username": "user2", "password": "user2"}];
  const { username, password } = req.body;
  console.log(username, password);
  users.map((user) => {
  if (user.username === username && user.password === password) {
    console.log("Login successful");
    return next();
  }else{
    return res.status(400).json({message: "Login failed"});
  }
  });
} catch (error) {
  return res.status(400).json({message: "Login failed", error: error});}
};

app.get("/",(req, res) => {
  res.sendFile(process.cwd() + "/client/login.html");
});

app.post("/login", (req, res) => {
  const users = 
    [{"username": "admin", "password": "admin"},
    {"username": "user1", "password": "user1"},
    {"username": "user2", "password": "user2"}];
  const { username, password } = req.body;
  console.log(username, password);
  users.map((user) => {
  if (user.username === username && user.password === password) {
    console.log("Login successful");
    return res.status(200).json({message: "Login successful", data: user});
  }
  });
  return res.status(400).json({message: "Login failed"});
}
);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.static("client"));

