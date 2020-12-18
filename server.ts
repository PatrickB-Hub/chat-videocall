import http = require("http");
import express = require("express");
const app = express();
const server = http.createServer(app);
import socket = require("socket.io");
const io = socket(server, {});

import { allUsersType, messageType, sendMessageType } from "./types";

let users: allUsersType = [];
const messages: { [key: string]: messageType[] } = {
  general: [],
  javascript: [],
  random: [],
  jokes: []
};

// listener for new connections
io.on("connection", (socket) => {
  // create new user and send (to everyone) the users list
  socket.on("JOIN_SERVER", (username: string) => {
    const user = {
      username,
      id: socket.id
    }
    users.push(user);
    io.emit("CONNECTED_USERS", users);
  });

  // let user join a chat and send (to one user) the previous messages of that room
  socket.on("JOIN_CHAT", (roomName: string, fn: (m: messageType[]) => void) => {
    socket.join(roomName);
    fn(messages[roomName]);
  });

  // receive new messages and send them to their receivers
  socket.on("SEND_MESSAGE",
    ({ content, sender, receiver, chatName, isChannel, type }: sendMessageType) => {
      const payload = {
        sender,
        chatName: isChannel ? chatName : sender,
        content,
        type
      };
      socket.to(receiver).emit("RECEIVED_MESSAGE", payload);

      // keep track of sent messages
      messages[chatName] && messages[chatName].push({
        sender,
        content,
        type
      });
    }
  );

  // when a user leaves, update users and propagate changes to everyone
  socket.on("LEAVE_SERVER", () => {
    users = users.filter((user) => user.id !== socket.id);
    io.emit("CONNECTED_USERS", users);
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.id !== socket.id);
    io.emit("CONNECTED_USERS", users);
  });
});

const PORT = 5550;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`))