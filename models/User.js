const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  nickName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: "String",
    required: true,
  },
  avatar: {
    type: String,
    default: "user.png",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

module.exports = model("User", UserSchema, "users");
