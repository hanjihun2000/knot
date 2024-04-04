const mongoose = require('mongoose');

const tempUserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    accountType: { type: String, default: 'user' },
    profilePicture: { type: String, default: null },
    bio: { type: String, default: null },
    theme: { type: String, default: null },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    __v: { type: Number, default: 0 }
  });

const User = mongoose.model('User', tempUserSchema);

const schema = User.schema;
console.log(schema.options.collection);

module.exports = {User};

