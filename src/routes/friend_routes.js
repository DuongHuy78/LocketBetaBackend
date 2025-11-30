import express from "express";
import {
  getFriends,
  addFriend,
  deleteFriend
} from "../controller/friend_controller.js";

const router = express.Router();

router.get("/:userId", getFriends);
router.post("/", addFriend);
router.delete("/:friendId", deleteFriend);

export default router;
