import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false
});

export default socket;