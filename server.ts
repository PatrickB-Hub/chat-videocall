import http = require("http");
import express = require("express");
const app = express();
const server = http.createServer(app);
import socket = require("socket.io");
const io = socket(server, {});

io.on("connection", (socket) => {
  console.log("new connection", socket);
});

const PORT = 5550;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));