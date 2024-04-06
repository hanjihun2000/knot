const mongoose = require("../index");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    postId: { type: Number, required: true, unique: true },
    username: { type: String, required: true, ref:"user" },
    title: { type: String, required: true },
    text: { type: String, required: false },
    media: {
        buffer: { type: Buffer, required: true },
        mimetype: { type: String, required: true }
    },
    likeDislike: { type: Array, required: false },
    comments: { type: Array, required: false },
    IsReported: { type: Boolean, required: false },
});

module.exports = mongoose.model("post", postSchema);