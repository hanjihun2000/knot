const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/register", async (req, res) => {
    // req.body for form
    // console.log(req);
    // console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    // check if the username is inside the users database
	const userExists = await User.exists({ username: username });
	console.log(userExists);
	if (userExists) {
		// if the username is already taken, return an error
		console.log("UsernameExistsError!");
        // send error response
        res.send({ status: "error", message: "Username already exists!" });
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

router.get("/fetchUser", async (req, res) => {
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

router.post("/login", async (req, res) => {
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

router.post("/logout", (req, res) => {
try {
	// TODO: Invalidate the token or perform any necessary logout actions

	res.json({ message: "Logout successful" });
} catch (error) {
	res.status(500).json({ message: error.message });
}
});


module.exports = router;
