const mongoose = require("../index");
const Schema = mongoose.Schema;

// Creating a new schema for users
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  accountType: { type: String, required: true },
  profilePicture: {
    buffer: { type: Buffer, required: false },
    mimetype: { type: String, required: false },
  },
  bio: { type: String, required: false },
  theme: { type: String, required: false },
  followers: { type: Array, required: false },
  following: { type: Array, required: false },
});

// Exporting the user model
module.exports = mongoose.model("user", userSchema);
