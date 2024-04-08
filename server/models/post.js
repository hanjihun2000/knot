const mongoose = require("../index");
const uri = process.env.ATLAS_URI;
const Schema = mongoose.Schema;

const postSchema = new Schema({
    postId: { type: Number, required: true, unique: true },
    username: { type: String, required: true, ref:"user" },
    originalPostId: { type: Number, required: false },
    originalUsername: { type: String, required: false },
    title: { type: String, required: true },
    text: { type: String, required: false },
    media: {
        buffer: { type: Buffer, required: false },
        mimetype: { type: String, required: false}
    },
    likes: { type: Array, required: false },
    dislikes: { type: Array, required: false },
    IsReported: { type: Boolean, required: false },
});

module.exports = mongoose.model("post", postSchema);