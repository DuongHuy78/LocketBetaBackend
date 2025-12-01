import Friend from "../models/Friend.js";
import User from "../models/User.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;

    const friends = await Friend.find({ userId });
    const friendIds = friends.map(f => f.friendId.toString());

    const users = await User.find({
      _id: { $nin: [userId, ...friendIds] }
    }).limit(10);

    const result = users.map(u => ({
      id: u._id,
      name: u.username || "Unknown",
      profileImage: u.avatarUrl || null,
      isActive: u.isActive || false,
      lastSeen: u.lastSeen || new Date(),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
