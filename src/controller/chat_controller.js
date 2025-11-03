const Chat = require('../models/Chat');

exports.getAllChats = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: 'UserId is required' });

    const chats = await Chat.find({ members: userId })
      .populate('members', 'name avatar')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'name avatar' }
      })
      .sort({ updatedAt: -1 })
      .lean();
    return res.json({ chats });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};