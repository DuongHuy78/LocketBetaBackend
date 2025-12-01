import Friend from "../models/Friend.js";
import User from "../models/User.js";

export const addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    const exists = await Friend.findOne({ userId, friendId });
    if (exists) {
      return res.status(400).json({ error: "Friend already added" });
    }

    const newFriend = new Friend({ userId, friendId });
    await newFriend.save();

    const friendUser = await User.findById(friendId);

    res.status(201).json({
      id: newFriend._id,
      userId: newFriend.userId,
      friendId: newFriend.friendId,
      name: friendUser?.username || "Unknown",
      profileImage: friendUser?.avatarUrl || null,
      isActive: friendUser?.isActive || false,
      lastSeen: friendUser?.lastSeen || new Date(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFriends = async (req, res) => {
  try {
    const userId = req.params.userId;

    const friends = await Friend.find({ userId });

    const result = await Promise.all(
      friends.map(async (f) => {
        const user = await User.findById(f.friendId);
        return {
          id: f.friendId,
          name: user?.username || "Unknown",
          profileImage: user?.avatarUrl || null,
          isActive: user?.isActive || false,
          lastSeen: user?.lastSeen || new Date(),
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const { userId } = req.body; 

    const deleted1 = await Friend.findOneAndDelete({ userId, friendId });
    const deleted2 = await Friend.findOneAndDelete({ userId: friendId, friendId: userId });

    if (!deleted1 && !deleted2) {
      return res.status(404).json({ error: "Friend not found" });
    }

    res.json({ message: "Friend removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
