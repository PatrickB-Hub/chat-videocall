import path = require("path");
import http = require("http");
require("dotenv").config();

import express = require("express");
const app = express();
const server = http.createServer(app);
import socket = require("socket.io");
const io = socket(server, {});

import {
  allUsersType,
  messageType,
  sendMessageType,
  joinRoomType,
  sendSignalPayloadType,
  returnedSignalPayloadType
} from "./types";


let users: allUsersType = [];
const messages: { [key: string]: messageType[] } = {
  general: [],
  javascript: [],
  random: [],
  jokes: []
};

const videoCallUsers: { [key: string]: string[] } = {};
const socketToRoom: { [key: string]: string } = {};

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


  // -------------------------------------------------------
  //                     Video Call
  // -------------------------------------------------------

  // allow user to join a room and send the ids of the other users in that room
  socket.on("JOIN_ROOM", ({ roomID, username }: joinRoomType) => {
    // join exiting room or create a new one
    if (videoCallUsers[roomID]) {
      const length = videoCallUsers[roomID].length;
      if (length >= 4) {
        socket.emit("ROOM_FULL");
        return;
      }
      videoCallUsers[roomID].push(socket.id);
    } else {
      videoCallUsers[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = videoCallUsers[roomID].filter(id => id !== socket.id);
    socket.emit("USERS_IN_ROOM", usersInThisRoom);

    // keep user connected in chat so we can send videocall invitations
    if (username) {
      const user = {
        username,
        id: socket.id
      }
      users.push(user);
      io.emit("CONNECTED_USERS", users);
    }
  });

  // notify the other users when a new user joined a room
  socket.on("SEND_SIGNAL", (payload: sendSignalPayloadType) => {
    io.to(payload.userToSignal).emit(
      "USER_JOINED_ROOM",
      { signal: payload.signal, callerID: payload.callerID }
    );
  });

  socket.on("RETURN_SIGNAL", (payload: returnedSignalPayloadType) => {
    io.to(payload.callerID).emit(
      "RECEIVED_RETURN_SIGNAL",
      { signal: payload.signal, id: socket.id }
    );
  });

  // remove user from room and send the id to the remaining users
  socket.on("LEAVE_ROOM", () => {
    const roomID = socketToRoom[socket.id];
    let room = videoCallUsers[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      videoCallUsers[roomID] = room;
    }
    socket.broadcast.emit("USER_LEFT_ROOM", socket.id);

    users = users.filter((user) => user.id !== socket.id);
    io.emit("CONNECTED_USERS", users);
  });

  socket.on("disconnect", () => {
    // remove user from room and send the id to the remaining users
    const roomID = socketToRoom[socket.id];
    let room = videoCallUsers[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      videoCallUsers[roomID] = room;
    }
    socket.broadcast.emit("USER_LEFT_ROOM", socket.id);

    users = users.filter((user) => user.id !== socket.id);
    io.emit("CONNECTED_USERS", users);
  });
});

// serve static files in production
if (process.env.PROD) {
  app.use(express.static(path.join(__dirname, "./client/build")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
}

const PORT = process.env.PORT || 5550;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`))