const { Schema, model } = require("mongoose");

const PostSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  userData: {
    type: Object,
  },
  text: {
    type: String,
    trim: true,
  },
  file: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Post", PostSchema, "posts");
