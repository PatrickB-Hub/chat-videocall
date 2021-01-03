"use strict";
exports.__esModule = true;
var path = require("path");
var http = require("http");
require("dotenv").config();
var express = require("express");
var app = express();
var server = http.createServer(app);
var socket = require("socket.io");
var io = socket(server, {});
var users = [];
var messages = {
    general: [],
    javascript: [],
    random: [],
    jokes: []
};
var videoCallUsers = {};
var socketToRoom = {};
// listener for new connections
io.on("connection", function (socket) {
    // create new user and send (to everyone) the users list
    socket.on("JOIN_SERVER", function (username) {
        var user = {
            username: username,
            id: socket.id
        };
        users.push(user);
        io.emit("CONNECTED_USERS", users);
    });
    // let user join a chat and send (to one user) the previous messages of that room
    socket.on("JOIN_CHAT", function (roomName, fn) {
        socket.join(roomName);
        fn(messages[roomName]);
    });
    // receive new messages and send them to their receivers
    socket.on("SEND_MESSAGE", function (_a) {
        var content = _a.content, sender = _a.sender, receiver = _a.receiver, chatName = _a.chatName, isChannel = _a.isChannel, type = _a.type;
        var payload = {
            sender: sender,
            chatName: isChannel ? chatName : sender,
            content: content,
            type: type
        };
        socket.to(receiver).emit("RECEIVED_MESSAGE", payload);
        // keep track of sent messages
        messages[chatName] && messages[chatName].push({
            sender: sender,
            content: content,
            type: type
        });
    });
    // when a user leaves, update users and propagate changes to everyone
    socket.on("LEAVE_SERVER", function () {
        users = users.filter(function (user) { return user.id !== socket.id; });
        io.emit("CONNECTED_USERS", users);
    });
    // -------------------------------------------------------
    //                     Video Call
    // -------------------------------------------------------
    // allow user to join a room and send the ids of the other users in that room
    socket.on("JOIN_ROOM", function (_a) {
        var roomID = _a.roomID, username = _a.username;
        // join exiting room or create a new one
        if (videoCallUsers[roomID]) {
            var length_1 = videoCallUsers[roomID].length;
            if (length_1 >= 4) {
                socket.emit("ROOM_FULL");
                return;
            }
            videoCallUsers[roomID].push(socket.id);
        }
        else {
            videoCallUsers[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        var usersInThisRoom = videoCallUsers[roomID].filter(function (id) { return id !== socket.id; });
        socket.emit("USERS_IN_ROOM", usersInThisRoom);
        // keep user connected in chat so we can send videocall invitations
        if (username) {
            var user = {
                username: username,
                id: socket.id
            };
            users.push(user);
            io.emit("CONNECTED_USERS", users);
        }
    });
    // notify the other users when a new user joined a room
    socket.on("SEND_SIGNAL", function (payload) {
        io.to(payload.userToSignal).emit("USER_JOINED_ROOM", { signal: payload.signal, callerID: payload.callerID });
    });
    socket.on("RETURN_SIGNAL", function (payload) {
        io.to(payload.callerID).emit("RECEIVED_RETURN_SIGNAL", { signal: payload.signal, id: socket.id });
    });
    // remove user from room and send the id to the remaining users
    socket.on("LEAVE_ROOM", function () {
        var roomID = socketToRoom[socket.id];
        var room = videoCallUsers[roomID];
        if (room) {
            room = room.filter(function (id) { return id !== socket.id; });
            videoCallUsers[roomID] = room;
        }
        socket.broadcast.emit("USER_LEFT_ROOM", socket.id);
        users = users.filter(function (user) { return user.id !== socket.id; });
        io.emit("CONNECTED_USERS", users);
    });
    socket.on("disconnect", function () {
        // remove user from room and send the id to the remaining users
        var roomID = socketToRoom[socket.id];
        var room = videoCallUsers[roomID];
        if (room) {
            room = room.filter(function (id) { return id !== socket.id; });
            videoCallUsers[roomID] = room;
        }
        socket.broadcast.emit("USER_LEFT_ROOM", socket.id);
        users = users.filter(function (user) { return user.id !== socket.id; });
        io.emit("CONNECTED_USERS", users);
    });
});
// serve static files in production
if (process.env.PROD) {
    app.use(express.static(path.join(__dirname, "./client/build")));
    app.get("*", function (_, res) {
        res.sendFile(path.join(__dirname, "./client/build/index.html"));
    });
}
var PORT = process.env.PORT || 5550;
server.listen(PORT, function () { return console.log("Server is running on port " + PORT + "."); });
