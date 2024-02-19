const { Schema, model } = require("mongoose");

const FollowSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
  },
  userData: {
    type: Object,
  },
  followed: {
    type: Schema.ObjectId,
    ref: "User",
  },
  followedData: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Follow", FollowSchema, "follows");
