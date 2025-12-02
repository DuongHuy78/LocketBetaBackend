import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import { v2 as cloudinary } from "cloudinary";

//lấy toàn bộ messages
export const getAllMessages = async (req, res) => {
  const chatId = req.params.chatId;
  if (!chatId) return res.status(400).json({ error: "chatId is required" });

  try {
    const messages = await Message.find({ chatId: chatId })
      .populate("sender", "username avatarUrl")
      .sort({ createdAt: -1 });
    // console.log("Messages: " + messages);
    return res.json(messages);
  } catch (e) {
    return res.status(500).json({ error: e.Message });
  }
};

//xóa message
export const deleteMessage = async (req, res) => {
  const messageId = req.params.messageId || req.body.messageId;
  if (!messageId)
    return res.status(403).json({ error: "messageId is required" });
  try {
    const msg = await Message.findById(messageId).lean();
    if (!msg) return res.status(404).json({ error: "Message not found" });
    // Optional: kiểm tra quyền (nếu client gửi userId hoặc bạn có middleware auth)
    // const requester = req.body.userId || req.query.userId;
    // if (requester && String(msg.sender) !== String(requester)) {
    //     return res.status(403).json({ error: 'Not allowed to delete this message' });
    // }
    console.log("Id của message cần xóa : " + messageId);
    if (msg.type == "image") {
      console.log("DEBUG: đã vào xóa của image");
      const publicId = getPublicIdFromUrl(msg.content);
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log("Lỗi xóa image: " + error.toString());
        return res.status(500).json({ error: "Không thể xóa ảnh" });
      }
    }

    await Message.findByIdAndDelete(messageId);

    const chat = await Chat.findById(msg.chatId).select("lastMessage").lean();
    if (chat && String(chat.lastMessage) === String(messageId)) {
      const last = await Message.findOne({ chatId: msg.chatId })
        .sort({ createdAt: -1 })
        .select("_id")
        .lean();
      await Chat.findByIdAndUpdate(msg.chatId, {
        lastMessage: last ? last._id : null,
        updatedAt: new Date(),
      });

      const updatedChat = await Chat.findById(msg.chatId)
        .populate("lastMessage", "content sender createdAt")
        .populate("members", "username avatarUrl")
        .lean();

      const chatPayload = JSON.stringify({
        event: "chat_updated",
        chat: updatedChat,
      });
      if (chat && Array.isArray(chat.members)) {
        for (const memberId of chat.members) {
          const clients = webSockets[String(memberId)];
          if (!clients) continue;
          for (const client of clients) {
            if (client && client.readyState === 1) {
              // 1 = OPEN
              client.send(chatPayload);
            }
          }
        }
      } else {
        ws.send(chatPayload);
      }
    }

    return res.status(200);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//chỉnh sửa message
export const updatedMessage = async (req, res) => {
  const messageId = req.params.messageId || req.body.messageId;
  if (!messageId)
    return res.status(403).json({ error: "messageId is required" });

  const { content } = req.body;
  if (!content && typeof content !== "string") {
    return res.status(400).json({ error: "content is required" });
  }

  try {
    const msg = await Message.findById(messageId).lean();
    if (!msg) return res.status(404).json({ error: "Message not found" });
    // Optional: kiểm tra quyền (nếu client gửi userId hoặc bạn có middleware auth)
    const requester = req.body.userId || req.query.userId;
    if (requester && String(msg.sender) !== String(requester)) {
      return res
        .status(403)
        .json({ error: "Not allowed to delete this message" });
    }

    const update = { content };
    await Message.findByIdAndUpdate(messageId, {
      content: update,
    });

    return res.status(200).json({ status: 200, messageId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//nhận ảnh từ cline đưa lên cloudinary tạo payload
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploads" });
    }

    console.log("SERVER CHat ID :" + req.body.chatId);
    console.log("SERVER userId:" + req.body.userId);

    const fileUrl = req.file.path;
    const saved = await Message.create({
      chatId: req.body.chatId,
      sender: req.body.userId,
      type: "image",
      content: fileUrl,
      createdAt: new Date(),
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      lastMessage: saved._id,
      updatedAt: new Date(),
    }).catch(() => {});

    const updatedChat = await Chat.findById(req.body.chatId)
      .populate("lastMessage", "content sender createdAt")
      .populate("members", "username avatarUrl")
      .lean();

    // Populate sender small payload
    const populated = await Message.findById(saved._id)
      .populate("sender", "username avatarUrl")
      .lean();

    // Broadcast to all connected members of the chat if known, else send only to sender
    const chat = await Chat.findById(req.body.chatId)
      .select("members")
      .lean()
      .catch(() => null);
    const messagePayload = JSON.stringify({
      event: "message",
      message: populated,
    });
    const chatPayload = JSON.stringify({ event: "v", chat: updatedChat });

    const webSockets = req.app.locals.webSockets || {};

    if (chat && Array.isArray(chat.members)) {
      for (const memberId of chat.members) {
        const clients = webSockets[String(memberId)];
        if (!clients) continue;
        for (const client of clients) {
          if (client && client.readyState === 1) {
            // 1 = OPEN
            client.send(chatPayload);
            client.send(messagePayload);
          }
        }
      }
    }
    res.status(200).json({ fileUrl: fileUrl });
  } catch (error) {
    console.error("uploadImage error", error);
    return res.status(500).json({ error: error.message });
  }
};

//connect với websocket
export const handleWsConnection = async (ws, req, wss, webSockets) => {
  let userID = null;
  try {
    const fullUrl = new URL(req.url, `http://${req.headers.host}`);
    userID = fullUrl.searchParams.get("userId");
  } catch (e) {
    const match = (req.url || "").match(/[?&]userId=([^&]+)/);
    if (match) userID = decodeURIComponent(match[1]);
  }

  if (!userID) {
    ws.close(1008, "Missing userId");
    return;
  }
  if (!webSockets[userID]) {
    webSockets[userID] = new Set();
  }

  webSockets[userID].add(ws); //thêm người dùng mới vào danh sách đang online
  // const payload = JSON.stringify({
  //     event: 'active'
  // })
  console.log(
    "User " + userID + "; sockets =" + webSockets[userID].size + " Connected"
  );

  ws.on("message", async (message) => {
    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (e) {
      ws.send(JSON.stringify({ status: "error", reason: "invalid_json" }));
      return;
    }

    const evt = data.event || "message";
    var timeSend;

    try {
      //presence
      if (evt === "presence") {
        const status = data.status; // 'online' | 'heartbeat' | 'offline'
        const curruntUserId = data.userId;
        timeSend = data.timeSend;

        // parse timeSend (fallback to now if invalid/missing)
        let sentTs = Date.now();
        if (timeSend) {
          const parsed = Date.parse(timeSend);
          if (!isNaN(parsed)) sentTs = parsed;
        }

        console.log("DEBUG: SERVER MessagerController states:" + status + "; senderId: " + curruntUserId);

        try {
          const chats = await Chat.find({ members: curruntUserId })
            .select("members")
            .lean();
          const memberIds = new Set();
          chats.forEach((c) =>
            (c.members || []).forEach((m) => memberIds.add(String(m)))
          );
          const payload = JSON.stringify({
            event: "presence_update",
            userId: curruntUserId,
            status: status,
          });
          for (const member of memberIds) {
            if(member == curruntUserId) continue;
            const clients = webSockets[member];
            if (!clients) continue;
            for (const client of clients) {
              if (client && client.readyState === 1) {
                try {
                  client.send(payload);
                } catch (_) {}
              }
            }
          }
        } catch (e) {
          /* ignore presence broadcast errors */
        }
        return;
      }

      // TYPING
      if (evt === "isTyping") {
        const chatId = data.chatId;
        const isTyping = data.status;
        const senderId = data.userId;

        console.log("DEBUG: SERVER MessagerController isTping:" + isTyping);
        
        const typingPayload = JSON.stringify({
          event: "isTyping",
          'status' : isTyping,
          timeSend: new Date().toISOString(),
        });

        try {
            const chat = await Chat.findById(chatId).select("members").lean();
            if (chat && Array.isArray(chat.members)) {
            for (const memberId of chat.members) {
                if (String(memberId) === String(senderId)) continue; // Nếu người dùng đã có trong websockets list thì ko thêm
                const clients = webSockets[String(memberId)];
                if (!clients) continue;
                for (const client of clients) {
                if (client && client.readyState === 1) {
                    try {
                    client.send(typingPayload);
                    } catch (_) {}
                }
                }
            }
            }
        } catch (e) {
            /* ignore */
        }
        return;
      }

      // MESSAGE
      if (evt === "message") {
        const { chatId, content, type = "text" } = data;
        if (!chatId || !content) {
          ws.send(
            JSON.stringify({ status: "error", reason: "missing_fields" })
          );
          return;
        }

        // TODO: validate auth / permission that userID is member of chatId

        const saved = await Message.create({
          chatId,
          sender: userID,
          content,
          type,
          createdAt: new Date(),
        });

        // Update chat.lastMessage and updatedAt
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: saved._id,
          updatedAt: new Date(),
        }).catch(() => {});

        const updatedChat = await Chat.findById(chatId)
          .populate("lastMessage", "content sender createdAt")
          .populate("members", "username avatarUrl")
          .lean();
        const populated = await Message.findById(saved._id)
          .populate("sender", "username avatarUrl")
          .lean();

        // Broadcast to members
        const chat = await Chat.findById(chatId)
          .select("members")
          .lean()
          .catch(() => null);
        const messagePayload = JSON.stringify({
          event: "message",
          message: populated,
        });
        const chatPayload = JSON.stringify({
          event: "chat_updated",
          chat: updatedChat,
        });

        if (chat && Array.isArray(chat.members)) {
          for (const memberId of chat.members) {
            const clients = webSockets[String(memberId)];
            if (!clients) continue;
            for (const client of clients) {
              if (client && client.readyState === 1) {
                try {
                  client.send(chatPayload);
                  client.send(messagePayload);
                } catch (e) {
                  /* ignore per-client errors */
                }
              }
            }
          }
        } else {
          ws.send(messagePayload);
          ws.send(chatPayload);
        }

        // ack to the sender with saved id
        ws.send(JSON.stringify({ status: "ok", messageId: saved._id }));
        return;
      }

      // unknown event
      ws.send(
        JSON.stringify({ status: "error", reason: "unknown_event", event: evt })
      );
    } catch (err) {
      console.error("ws message handler error:", err);
      try {
        ws.send(JSON.stringify({ status: "error", reason: err.message }));
      } catch (_) {}
    }
  });

  ws.on("close", function () {
    const sockets = webSockets[userID];
    if (sockets) {
      sockets.delete(ws);
      if (sockets.size === 0) {
        delete webSockets[userID];
      }
    }

    console.log(`User Disconnected: ${userID}`);
  });

  ws.send(JSON.stringify({ status: "connected", userId: userID }));
};

// HÀM PHỤ TRỢ: Tách Public ID từ URL của cloudinary
const getPublicIdFromUrl = (url) => {
  // Regex này cắt bỏ phần domain, version (v1234), và đuôi file (.jpg, .png)
  // Input: https://res.cloudinary.com/.../upload/v1623/folder/my_image.jpg
  // Output: folder/my_image
  const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
