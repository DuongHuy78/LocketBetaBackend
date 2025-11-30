import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

// 1. Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// 2. Cấu hình Storage cho Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'locketBeta/images/', // Tên folder bạn muốn lưu trên Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Định dạng cho phép
    // transformation: [{ width: 500, height: 500, crop: 'limit' }], // (Tùy chọn) Resize ảnh trước khi lưu
  },
});

// 3. Khởi tạo Multer upload
const uploadCloud = multer({ storage });

export default uploadCloud;