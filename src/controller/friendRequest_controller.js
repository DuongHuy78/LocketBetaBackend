// friendRequest_controller.js
import FriendRequest from "../models/FriendRequest.js";
import Friend from "../models/Friend.js";
import User from "../models/User.js";

// lấy danh sách yêu cầu kết bạn
export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.params.userId;

    const requests = await FriendRequest.find({
      receiverId: userId,
      status: "pending",
    });

    const result = await Promise.all(
      requests.map(async (reqItem) => {
        const sender = await User.findById(reqItem.senderId);

        return {
          id: reqItem._id.toString(),
          senderId: reqItem.senderId,
          name: sender?.username || "Unknown",
          profileImage: sender?.avatarUrl || null,
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// gửi lời mời kết bạn
export const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const exists = await FriendRequest.findOne({
      senderId,
      receiverId,
      status: "pending",
    });

    if (exists) {
      return res.status(400).json({ error: "Already sent" });
    }

    const newRequest = new FriendRequest({ senderId, receiverId });
    await newRequest.save();

    res.json({ message: "Request sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// accept friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const request = await FriendRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: "Not found" });

    request.status = "accepted";
    await request.save();

    // kết bạn 2 chiều
    await Friend.create({
      userId: request.senderId,
      friendId: request.receiverId,
    });
    await Friend.create({
      userId: request.receiverId,
      friendId: request.senderId,
    });

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// reject request
export const rejectFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    await FriendRequest.findByIdAndDelete(requestId);

    res.json({ message: "Friend request rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
