const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/register", async (req, res) => {
    // req.body for form data
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
	console.log(username, password, email);
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


module.exports = router;
