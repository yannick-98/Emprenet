const { Schema, model } = require("mongoose");

const ChatSchema = new Schema({
  user1: {
    type: Schema.ObjectId,
    ref: "User1",
  },
  user2: {
    type: Schema.ObjectId,
    ref: "User2",
  },
  user1data: {
    type: Object,
  },
  user2data: {
    type: Object,
  },
  messages: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Chat", ChatSchema, "chats");
