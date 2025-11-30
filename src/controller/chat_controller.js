import Chat from'../models/Chat.js';
import '../models/Message.js';
import '../models/User.js'
import FriendRequest from "../models/FriendRequest.js";
import Friend from "../models/Friend.js";

export const getAllChats = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: 'UserId is required' });

    const chats = await Chat.find({ members: userId })
      .populate('members', 'username avatar')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username avatar' }
      })
      .sort({ updatedAt: -1 })
      .lean();
    // console.log(chats);
    return res.json({ chats });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.Message });
  }
};

export const createChatFromAcceptFriendRequest = async (req, res) => {
  const requestId = req.body.requestId;
  if (!requestId) return res.status(400).json({ error: 'requestId is required' });

  try {
    const request = await FriendRequest.findById(requestId).lean();
    if (!request) return res.status(404).json({ error: 'Friend request not found' });

    const senderId = request.senderId;
    const receiverId = request.receiverId;

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: 'Invalid friend request data (missing user ids)' });
    }

    // if (!request.status || request.status !== 'accepted') {
    //   await FriendRequest.findByIdAndUpdate(requestId, { status: 'accepted' }).catch(() => {});
    // }

    // create Friend records (if not exists)
    const isExistsA = await Friend.findOne({ userId: senderId, friendId: receiverId }).lean().catch(() => null);
    const isExistsB = await Friend.findOne({ userId: receiverId, friendId: senderId }).lean().catch(() => null);
    if (!isExistsA) await Friend.create({ userId: senderId, friendId: receiverId }).catch(() => {});
    if (!isExistsB) await Friend.create({ userId: receiverId, friendId: senderId }).catch(() => {});


    let chat = await Chat.findOne({ members: { $all: [senderId, receiverId] } })
      .populate('members', 'username avatar')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username avatar' }
      })
      .lean();

    if (chat) {
      return res.status(200).json({ created: false, chat });
    }

    // create new chat
    const created = await Chat.create({
      members: [senderId, receiverId],
      updatedAt: new Date()
    });

    chat = await Chat.findById(created._id)
      .populate('members', 'username avatar')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username avatar' }
      })
      .lean();

    return res.status(201).json({ created: true, chat });
  } catch (err) {
    console.error('createChatFromFriendRequest error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
// ...existing code...
