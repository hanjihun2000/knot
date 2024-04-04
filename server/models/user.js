const mongoose = require("../index");
const uri = process.env.ATLAS_URI;
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Database connected!'))
//   .catch(err => console.log(err));
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    email: { type: String, required: true },
    accountType: { type: String, required: true },
    profilePicture: { type: Buffer, required: false },
    bio: { type: String, required: false },
    theme: { type: String, required: false },
    followers: { type: Array, required: false },
    following: { type: Array, required: false },
});

module.exports = mongoose.model("user", userSchema);