import { createContext } from "react";
import io from "socket.io-client";

const socket = io.connect("/");
const SocketContext = createContext(socket);

export { socket, SocketContext };