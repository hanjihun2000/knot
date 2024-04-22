const mongoose = require("../index");
const uri = process.env.ATLAS_URI;
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {
      type: String,
      required: true
    },
    receiver: {
      type: String,
      required: true
    },
    messageText: {
      type: String,
      required: true
    },
    timeOfMessage: {
      type: Date,
      default: Date.now
    }
  }, { timestamps: true }); // This adds createdAt and updatedAt timestamps


module.exports = mongoose.model("message", messageSchema);