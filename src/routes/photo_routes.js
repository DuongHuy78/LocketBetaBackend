import express from "express";
import uploadCloud from "../config/cloudinary.config.js"; // Multer Cloudinary
import {
  createPhoto,
  getAllPhotos,
  getDetailPhoto,
  deletePhoto,
  getPhotosByUserId,
  sendPhoto,
} from "../controller/photo_controller.js"; // Sửa path nếu cần

const router = express.Router();

// Create photo (upload trực tiếp lên Cloudinary)
router.post("/upload", uploadCloud.single("image"), createPhoto);

// Get photos by userId
router.get("/user/:userId", getPhotosByUserId);

// Get all photos (với pagination nếu cần)
router.get("/", getAllPhotos);

// Get detail photo
router.get("/:id", getDetailPhoto);

// Delete photo
router.delete("/:id", deletePhoto);

// send photo to friend
router.post("/sendPhoto", sendPhoto);
export default router;
