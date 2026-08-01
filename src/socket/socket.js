// src/socket/socket.js

import { io } from "socket.io-client";

export const socket = io(process.env.VITE_SERVER_URL ||"http://localhost:5000", {
  transports: ["websocket","polling"],
});