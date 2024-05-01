const mongoose = require("../index");
const Schema = mongoose.Schema;

// Creating a new schema for posts
const postSchema = new Schema({
  postId: { type: Number, required: true, unique: true },
  username: { type: String, required: true, ref: "user" },
  originalPostId: { type: Number, required: false },
  originalUsername: { type: String, required: false },
  title: { type: String, required: true },
  text: { type: String, required: false },
  media: {
    buffer: { type: Buffer, required: false },
    mimetype: { type: String, required: false },
  },
  likes: { type: Array, required: false },
  dislikes: { type: Array, required: false },
  IsReported: { type: Boolean, required: false },
});

// Exporting the post model
module.exports = mongoose.model("post", postSchema);
