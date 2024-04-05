const express = require("express");
const app = express();
const cors = require('cors');
// Enable All CORS Requests for development
app.use(express.json())
app.use(cors());

const multer = require("multer");
const router = express.Router();
const User = require("../models/user");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", upload.none(), async (req, res) => {
    // req.body for form
    // console.log(req);
    // console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    // check if the username is inside the users database
	const userExists = await User.exists({ username: username });
	if (userExists) {
		// if the username is already taken, return an error
		console.log("UsernameExistsError!");
        // send error response
        res.send({ status: "error", message: "Username already exists!" });
	} else if (!username || !password || !email) {
		// if the username, password, or email is empty, return an error
		console.log("EmptyFieldError!");
		// send error response
		res.send({ status: "error", message: "Please fill in all fields!" });
	} else {
		// create a new user account
		const user = new User({
			username: username,
			password: password,
			email: email,
			accountType: "user",
			profilePicture: null,
			bio: null,
			theme: null,
			followers: [],
			following: []
		});
		user.save();
        // send success response
        res.send({ status: "success", message: "User account created successfully!"});
	}
});

// router.get('/test', upload.none(), async (req, res) => {
// 	console.log(req.body.test);
// 	res.send("Hello World!");
// });

router.get("/fetchUser", upload.none(), async (req, res) => {
	try {
		console.log(req.body)
		const username = req.body.username;
		console.log(username);
		const user = await User.findOne({ username: username });

		if (!user) {
			return res.status(404).json({ message: "User not found!" });
		}

		res.json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/fetchAllUsernames", async (req, res) => {
	const users = await User.find();
	const usernames = users.map(user => user.username);
	res.send(usernames);
})

router.post("/login", upload.none(), async (req, res) => {
	console.log(req.body)
	try {
	  const { username, password } = req.body;
  
	  // Find the user by username
	  const user = await User.findOne({ username });
  
	  if (!user) {
		return res.status(401).json({ message: "Invalid username or password" });
	  }
  
	  // Check if the password is correct
	  if (user.password !== password) {
		return res.status(401).json({ message: "Invalid username or password" });
	  }
  
	  // TODO: Generate and send a token for authentication
  
	  res.json({ message: "Login successful" });
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
});

router.post("/logout", upload.none(), (req, res) => {
try {
	// TODO: Invalidate the token or perform any necessary logout actions

	res.json({ message: "Logout successful" });
} catch (error) {
	res.status(500).json({ message: error.message });
}
});

router.put("/editUserProfile", upload.single('profilePicture'), async (req, res) => {
	try {
	  const { username } = req.body;
  
	  // Find the user by username
	  const user = await User.findOne({ username: username });
  
	  if (!user) {
		return res.status(404).json({ message: "User not found!" });
	  }
  
	  // Update the fields
	  for (const field in req.body) {
		user[field] = req.body[field];
	  }
  
	  // Add image to user with buffer and mimetype
	  if (req.file) {
		user.profilePicture = {
		  buffer: req.file.buffer,
		  mimetype: req.file.mimetype
		};
	  } else {
		//set empty buffer
		user.profilePicture = {
		  buffer: null,
		  mimetype: null
		}
	  }
  
	  // Save the updated user
	  const updatedUser = await user.save();
  
	  res.json(updatedUser);
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
  });


  router.get("/viewProfilePicture/:username", async (req, res) => {
	try {
	  const { username } = req.params;
  
	  // Find the user by username
	  const user = await User.findOne({ username: username });
  
	  if (!user) {
		return res.status(404).json({ message: "User not found!" });
	  }
  
	  if (!user.profilePicture || !user.profilePicture.buffer) {
		return res.status(404).json({ message: "Profile picture not found!" });
	  }
  
	  // Set the response headers
	  res.set("Content-Type", user.profilePicture.mimetype);
  
	  // Send the profile picture buffer as the response
	  res.send(user.profilePicture.buffer);
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
  });


module.exports = router;
