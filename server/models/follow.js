const mongoose = require("../index");
const Schema = mongoose.Schema;

// Creating a new schema for follow relationships
const followSchema = new Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
});

// Exporting the follow model
module.exports = mongoose.model("follow", followSchema);
