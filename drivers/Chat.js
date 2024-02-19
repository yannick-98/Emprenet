const Chat = require("../models/Chat");

const newChat = async (req, res) => {
  try {
    let params = req.body;
    let user = req.user;
    console.log(user);
    const chat = new Chat({
      user1: req.user.id,
      user2: params.chat.user2,
      user1data: params.chat.user1data,
      user2data: params.chat.user2data,
    });
    await chat.save();
    return res.status(200).json({
      status: "success",
      message: "Chat created successfully",
      chat,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Chat creation failed",
      error,
    });
  }
};

const newMessage = async (req, res) => {
  try {
    let id = req.params.id;
    const chat = await Chat.findById(id);
    const message = req.body;
    console.log(message);
    chat.messages = [...chat.messages, message];
    await chat.save();
    return res.status(200).json({
      message: "Message added successfully",
      chat,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Message addition failed",
      error,
    });
  }
};

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      $or: [{ user1: req.user.id }, { user2: req.user.id }],
    });
    return res.status(200).json({
      status: "success",
      message: "Chats found",
      chats,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Chats not found",
      error,
    });
  }
};

const getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    return res.status(200).json({
      message: "Chat found",
      chat,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Chat not found",
      error,
    });
  }
};

// const updateChat = async (req, res) => {
//   try {
//     let params = req.body;
//     const chat = await Chat.findByIdAndUpdate(req.params.id, params);
//     return res.status(200).json({
//       message: "Chat updated successfully",
//       chat,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       message: "Chat update failed",
//       error,
//     });
//   }
// };

const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Chat deleted successfully",
      chat,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Chat deletion failed",
      error,
    });
  }
};

module.exports = {
  newChat,
  newMessage,
  getChats,
  getChat,
  //   updateChat,
  deleteChat,
};
