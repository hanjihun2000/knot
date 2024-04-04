const mongoose = require('mongoose');
const uri = "mongodb+srv://admin1:1234567890@knot-cluster.ggtkwpg.mongodb.net/?retryWrites=true&w=majority&appName=knot-cluster";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
  console.log("We're connected to the database!");

  // Perform operations inside this callback
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }
});


const tempUserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId},
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

