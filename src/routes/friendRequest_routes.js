import express from "express";
import {
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../controller/friendRequest_controller.js";

const router = express.Router();

router.get("/:userId", getFriendRequests);
router.post("/", sendFriendRequest);
router.patch("/accept/:requestId", acceptFriendRequest);
router.patch("/reject/:requestId", rejectFriendRequest);

export default router;
