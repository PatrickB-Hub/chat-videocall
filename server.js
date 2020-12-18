"use strict";
exports.__esModule = true;
var http = require("http");
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
    socket.on("disconnect", function () {
        users = users.filter(function (user) { return user.id !== socket.id; });
        io.emit("CONNECTED_USERS", users);
    });
});
var PORT = 5550;
server.listen(PORT, function () { return console.log("Server is running on port " + PORT + "."); });
