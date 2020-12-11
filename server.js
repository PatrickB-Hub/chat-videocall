"use strict";
exports.__esModule = true;
var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);
var PORT = 5550;
server.listen(PORT, function () { return console.log("Server is running on port " + PORT + "."); });
