"use strict";
exports.__esModule = true;
var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);
var socket = require("socket.io");
var io = socket(server, {});
io.on("connection", function (socket) {
    console.log("new connection", socket);
});
var PORT = 5550;
server.listen(PORT, function () { return console.log("Server is running on port " + PORT + "."); });
