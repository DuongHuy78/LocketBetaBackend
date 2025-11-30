import Photo from "../models/photo.js";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
// Lấy toàn bộ danh sách ảnh
export const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ timestamp: -1 });

    res.status(200).json({
      photos,
      total: photos.length,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách ảnh:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Tạo ảnh mới (upload file lên Cloudinary)
export const createPhoto = async (req, res) => {
  try {
    const { userId, caption } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Thiếu userId" });
    }

    // Nếu không có file gửi lên
    if (!req.file) {
      return res.status(400).json({ message: "Không có file ảnh" });
    }

    // req.file.path là URL của ảnh trên Cloudinary
    const imageUrl = req.file.path;

    const newPhoto = await Photo.create({
      userId,
      caption: caption || "",
      imageUrl,
      timestamp: new Date(),
    });

    res.status(201).json({
      message: "Upload ảnh lên Cloudinary thành công",
      photo: newPhoto,
    });
  } catch (error) {
    console.error("❌ Lỗi tạo ảnh:", error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy ảnh theo _id (MongoDB tự tạo)
export const getDetailPhoto = async (req, res) => {
  try {
    const { id } = req.params; // id ở đây là _id
    const photo = await Photo.findById(id); // dùng findById

    if (!photo) {
      return res.status(404).json({ message: "Ảnh không tồn tại" });
    }

    res.status(200).json(photo);
  } catch (error) {
    console.error("❌ Lỗi khi lấy chi tiết ảnh:", error);
    res.status(500).json({ message: error.message });
  }
};

// Xóa ảnh theo _id
export const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params; // id ở đây là _id
    const photo = await Photo.findByIdAndDelete(id);

    if (!photo) {
      return res.status(404).json({ message: "Ảnh không tồn tại" });
    }

    res.status(200).json({ message: "Xóa ảnh thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi xóa ảnh:", error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả ảnh của 1 user theo userId
export const getPhotosByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // userId được truyền từ URL

    if (!userId) {
      return res.status(400).json({ message: "Thiếu userId" });
    }

    // Tìm tất cả ảnh có userId tương ứng, sắp xếp mới nhất trước
    const photos = await Photo.find({ userId }).sort({ timestamp: -1 });

    res.status(200).json({
      photos,
      total: photos.length,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy ảnh theo userId:", error);
    res.status(500).json({ message: error.message });
  }
};

export const sendPhoto = async (req, res) => {
  const { senderId, receiverId, imageUrl, caption } = req.body;

  if (!senderId || !receiverId || !imageUrl) {
    return res
      .status(400)
      .json({ error: "senderId, receiverId và imageUrl là bắt buộc" });
  }

  try {
    // 1. Kiểm tra hoặc tạo chat giữa 2 người
    let chat = await Chat.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = await Chat.create({
        members: [senderId, receiverId],
      });
    }

    // 2. Tạo tin nhắn ảnh
    const imageMessage = await Message.create({
      chatId: chat._id,
      sender: senderId,
      type: "image",
      content: imageUrl,
      createdAt: new Date(),
    });

    // 3. Tạo tin nhắn text nếu có caption
    let textMessage = null;
    if (caption && caption.trim() !== "") {
      textMessage = await Message.create({
        chatId: chat._id,
        sender: senderId,
        type: "text",
        content: caption,
        createdAt: new Date(),
      });
    }

    // 4. Cập nhật lastMessage của chat (lấy message mới nhất)
    const lastMessage = textMessage || imageMessage;
    chat.lastMessage = lastMessage._id;
    chat.updatedAt = new Date();
    await chat.save();

    // 5. Trả về payload
    return res.status(200).json({
      message: "Gửi ảnh thành công",
      chatId: chat._id,
      messages: [imageMessage, textMessage].filter(Boolean),
    });
  } catch (err) {
    console.error("sendPhoto error:", err);
    return res.status(500).json({ error: err.message });
  }
};
