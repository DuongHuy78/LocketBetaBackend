import express from 'express';
import * as controller from '../controller/message_controller.js';
import uploadCloud from '../config/cloudinary.config.js';

const router = express.Router();
router.get('/:chatId', controller.getAllMessages);
router.post('/uploads/image', uploadCloud.single('file'), controller.uploadImage);
router.patch('/:messageId', controller.updatedMessage);
router.delete('/:messageId', controller.deleteMessage)

export default router;