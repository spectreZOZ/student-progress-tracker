// services/socket.ts

import { Socket, io } from "socket.io-client";

let socket: Socket | null = null;

export function initSocket() {
  if (socket) return socket;

  console.log("Initializing socket connection to http://localhost:5000");

  socket = io("http://localhost:5000", {
    forceNew: true,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected successfully:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("🚫 Socket connection error:", error.message);
    console.error("Full error:", error);
  });

  return socket;
}

export function getSocket() {
  if (!socket) {
    return initSocket();
  }
  return socket;
}
