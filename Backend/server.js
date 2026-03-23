import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import app from "./src/app.js";
import connectToDB from "./src/config/database.js";
import setupChatSocket from "./src/sockets/chat.socket.js";

connectToDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://resume-analysis-gray-five.vercel.app"
    ],
    credentials: true,
  },
});

// initialize socket
setupChatSocket(io);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});