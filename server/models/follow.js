const mongoose = require("../index");
const uri = process.env.ATLAS_URI;
const Schema = mongoose.Schema;

const followSchema = new Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true }
});

module.exports = mongoose.model("follow", followSchema);