import "dotenv/config";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./libs/db.js";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import PhotoRoute from "./routes/photo_routes.js";
import chatRouter from "./routes/chat_router.js";
import messageRouter from "./routes/message_router.js";
import userRouter from "./routes/user_routes.js";
import AuthRoute from "./routes/auth_routes.js";
// import FriendRoute from "./routes/friend_routes.js";
import FriendRoutes from "./routes/friend_routes.js";
import FriendRequestRoutes from "./routes/friendRequest_routes.js";
import RecommendationRoutes from "./routes/recommendation_routes.js";

// import RecommendationRouter from "./routes/recommendation_routes.js";
// import FriendRequestRouter from "./routes/friendRequest_routes.js";

// WebSocket controller
import { handleWsConnection } from "./controller/message_controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;

const app = express();

// ===== Middleware =====
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));

// Serve folder uploads nếu cần (nếu vẫn dùng upload local)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== Routes =====
app.use("/api/users", userRouter);
app.use("/api/photos", PhotoRoute);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);
app.use("/api/auth", AuthRoute);
// app.use("/api/friends", FriendRoute);
// app.use("/api/friend-requests", FriendRequestRouter);
// app.use("/api/users/recommendation", RecommendationRouter);
app.use("/api/friends", FriendRoutes);
app.use("/api/friend-requests", FriendRequestRoutes);
app.use("/api/recommendations", RecommendationRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// ===== HTTP & WebSocket server =====
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Global WebSocket map { userId: ws }
const webSockets = {};
app.locals.webSockets = webSockets;

// Handle WebSocket upgrade
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// WebSocket connection
wss.on("connection", (ws, req) => {
  console.log("✅ New WS connection established");

  handleWsConnection(ws, req, wss, webSockets);

  ws.on("close", () => {
    console.log("❌ WS connection closed");
    Object.keys(webSockets).forEach((userId) => {
      if (webSockets[userId] === ws) delete webSockets[userId];
    });
  });

  ws.on("error", (err) => {
    console.error("❌ WS error:", err);
  });
});

// ===== Connect DB & start server =====
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 HTTP + WS server listening on port ${PORT}`);
      console.log(`📡 WS endpoint: ws://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  });
