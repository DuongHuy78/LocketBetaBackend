import dotenv from "dotenv"; // Di chuyển lên đầu để load env sớm
dotenv.config(); // Load env vars (PORT, DB_URL, etc.)

import express from "express";
import connectDB from "./libs/db.js";
import PhotoRoute from "./routes/photo_routes.js"; // Photo routes (từ trước)
import chatRouter from "./routes/chat_router.js"; // Thêm import cho chat
import messageRouter from "./routes/message_router.js"; // Thêm import cho messages
import userRouter from "./routes/user_routes.js";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import { handleWsConnection } from "./controller/message_controller.js"; // Sửa path: controllers/ (plural, chuẩn convention)
import AuthRoute from "./routes/auth_routes.js";
import FriendRoute from "./routes/friend_routes.js";
// import RecommendationRouter from "./routes/recommendation_routes.js";
// import FriendRequestRouter from "./routes/friendRequest_routes.js";

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // Hoặc cụ thể: "http://localhost:3000" cho frontend
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" })); // Giới hạn body size cho image upload nếu cần

// Routes
app.use("/api/users", userRouter);
app.use("/api/photos", PhotoRoute);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);
app.use("/api/auth", AuthRoute);
app.use("/api/friends", FriendRoute);
// app.use("/api/friend-requests", FriendRequestRouter);
// app.use("/api/users/recommendation", RecommendationRouter);

// connect to DB and start server

// Health check endpoint (optional)
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Create HTTP server & WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });
const webSockets = {}; // Sửa: const thay var, global map { userId: ws }
//gắn vào để có thể gọi ở trong message controller để gửi payload
app.locals.webSockets = webSockets;

// Handle WS upgrade (với basic auth example)
server.on("upgrade", (request, socket, head) => {
  // Basic auth: Kiểm tra token từ query (e.g., ws://localhost:5000?token=abc)
  // const { url } = request;
  // const token = new URLSearchParams(url.split("?")[1]).get("token");
  // if (!token) {
  //   // Nếu cần auth thực, verify JWT ở đây
  //   socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
  //   socket.destroy();
  //   return;
  // }

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

wss.on("connection", (ws, req) => {
  console.log("✅ New WS connection established"); // Log connection
  handleWsConnection(ws, req, wss, webSockets); // Pass webSockets để manage connections (e.g., userId -> ws)

  // Cleanup on disconnect
  ws.on("close", () => {
    console.log("❌ WS connection closed");
    // Remove from webSockets map (implement in handleWsConnection nếu cần)
    Object.keys(webSockets).forEach((userId) => {
      if (webSockets[userId] === ws) {
        delete webSockets[userId];
      }
    });
  });

  ws.on("error", (err) => {
    console.error("❌ WS error:", err);
  });
});

// Connect DB and start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 HTTP + WS server listening on port ${PORT}`);
      console.log(`📡 WS endpoint: ws://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1); // Exit nếu DB fail
  });
