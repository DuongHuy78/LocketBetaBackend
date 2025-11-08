import express from 'express';
import connectDB from './config/database.js';
import cors from 'cors';
import chatRouter from './routes/chat_router.js';
import messageRouter from './routes/message_router.js';
import http from"http";
import { WebSocketServer } from 'ws';
import { handleWsConnection } from './controller/message_controller.js';


const app = express();
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/chats', chatRouter);
app.use('/api/messages', messageRouter);


// create http server from express
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });
var webSockets = {};

server.on("upgrade", (request, socket, head) => {
  // có thể kiểm tra auth header / cookie ở đây trước khi upgrade
  // ví dụ: nếu không auth => socket.destroy()
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

wss.on('connection', (ws, req) => {
  handleWsConnection(ws, req, wss, webSockets);
})

const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


server.listen(PORT, () => {
  console.log(`HTTP + WS server listening on port ${PORT}`);
});