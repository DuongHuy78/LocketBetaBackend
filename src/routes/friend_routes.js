import express from "express";
import {
  getFriends,
  addFriend,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  getRecommendations,
  rejectFriendRequest,
} from "../controller/friend_controller.js";

const router = express.Router();

router.get("/:userId", getFriends);
router.get("/requests/:userId", getFriendRequests);
router.get("/users/recommendation/:userId", getRecommendations);
router.post("/", addFriend);
router.post("/requests", sendFriendRequest);
router.patch("/requests/accept/:requestId", acceptFriendRequest);
router.patch("/requests/reject/:requestId", rejectFriendRequest);


export default router;
