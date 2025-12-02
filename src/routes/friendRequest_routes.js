import express from "express";
import {
  getFriendRequests,
  sendFriendRequest,
  unsendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../controller/friendRequest_controller.js";

const router = express.Router();

router.get("/:userId", getFriendRequests);
router.post("/", sendFriendRequest);
router.delete("/", unsendFriendRequest);
router.patch("/accept/:requestId", acceptFriendRequest);
router.patch("/reject/:requestId", rejectFriendRequest);

export default router;
