import http = require("http");
import express = require("express");
const app = express();
const server = http.createServer(app);

const PORT = 5550;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));