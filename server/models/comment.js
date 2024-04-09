const mongoose = require("../index");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    postId: { type: Number, required: true},
    commentId: { type: Number, required: true, unique: true },
    text: { type: String, required: true },
    likes: { type: Array, required: true },
    dislikes: { type: Array, required: true },
    username: { type: String, required: true, ref:"user" },
    IsReported: { type: Boolean, required: true },
});

module.exports = mongoose.model("comment", commentSchema);