const mongoose = require("../index");
const Schema = mongoose.Schema;

// Creating a new schema for comments
const commentSchema = new Schema({
  postId: { type: Number, required: true },
  commentId: { type: Number, required: true, unique: true },
  text: { type: String, required: true },
  likes: { type: Array, required: true },
  dislikes: { type: Array, required: true },
  username: { type: String, required: true, ref: "user" },
  IsReported: { type: Boolean, required: true },
});

// Exporting the comment model
module.exports = mongoose.model("comment", commentSchema);
