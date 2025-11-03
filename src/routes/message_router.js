const express = require('express');
const router = express.Router();
const chatController = require('../controller/chat_controller');

router.get('/:userId', chatController.getAllChats);

module.exports = router;