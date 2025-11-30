import express from "express";
import { getFriends, addFriend } from "../controller/friend_controller.js";

const router = express.Router();

router.get("/:userId", getFriends);
router.post("/", addFriend);

export default router;
