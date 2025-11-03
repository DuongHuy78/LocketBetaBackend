const express = require('express');
const router = express.Router();
const controller = require("../controller/message_controller");

router.get('/', controller.getAllMessagers);


module.exports = router;