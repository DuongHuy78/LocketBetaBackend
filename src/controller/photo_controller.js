import Photo from "../models/photo.js";

// Lấy danh sách ảnh mới nhất (với pagination)
export const getAllPhotos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const photos = await Photo.find()
      .populate("userId", "username email") // Optional: Lấy info user
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Photo.countDocuments();

    res.status(200).json({
      photos,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách ảnh:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Tạo ảnh mới
export const createPhoto = async (req, res) => {
  try {
    const { userId, imageUrl, caption } = req.body;

    if (!userId || !imageUrl) {
      return res.status(400).json({ message: "Thiếu userId hoặc imageUrl" });
    }

    // Tạo custom id nếu chưa có (ví dụ: dùng timestamp + random)
    const customId = caption
      ? `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      : Date.now().toString();

    const newPhoto = await Photo.create({
      id: customId, // Tự generate nếu cần, hoặc lấy từ req.body
      userId,
      imageUrl,
      caption,
      // timestamp dùng default Date.now
    });

    res.status(201).json({
      message: "Tạo ảnh thành công",
      photo: newPhoto,
    });
  } catch (error) {
    console.error("❌ Lỗi tạo ảnh:", error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy ảnh theo ID (sửa findById → findOne({id}))
export const getDetailPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findOne({ id }) // Sửa: Tìm theo field 'id' (String)
      .populate("userId", "username email");

    if (!photo) {
      return res.status(404).json({ message: "Ảnh không tồn tại" });
    }

    res.status(200).json(photo);
  } catch (error) {
    console.error("❌ Lỗi khi lấy chi tiết ảnh:", error);
    res.status(500).json({ message: error.message });
  }
};

// Xóa ảnh (sửa findByIdAndDelete → findOneAndDelete({id}))
export const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findOneAndDelete({ id }); // Sửa: Xóa theo field 'id' (String)

    if (!photo) {
      return res.status(404).json({ message: "Ảnh không tồn tại" });
    }

    res.status(200).json({ message: "Xóa ảnh thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi xóa ảnh:", error);
    res.status(500).json({ message: error.message });
  }
};
