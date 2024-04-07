const mongoose = require("../index");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    postId: { type: Number, required: true, unique: true },
    commentId: { type: Number, required: true, unique: true },
    text: { type: String, required: true },
    likesDislikes: { type: Array, required: true }, // [[username who likes a post], [username who dislikes a post]]
    username: { type: String, required: true, ref:"user" },
    isReported: { type: Boolean, required: true },
});

module.exports = mongoose.model("comment", commentSchema);