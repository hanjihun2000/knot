const mongoose = require("../index");
const Schema = mongoose.Schema;

// Creating a new schema for messages
const messageSchema = new Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    messageText: {
      type: String,
      required: true,
    },
    timeOfMessage: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Exporting the message model
module.exports = mongoose.model("message", messageSchema);
