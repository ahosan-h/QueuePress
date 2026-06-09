import { io, Socket } from "socket.io-client";

const backendUrl = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "")
  : "http://localhost:4444";

export function createBlogSocket(): Socket {
  return io(backendUrl, {
    path: "/socket.io",
    transports: ["websocket"],
    autoConnect: false,
  });
}
