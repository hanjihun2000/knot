const express = require("express");
const app = express();
const cors = require("cors");
// Enable All CORS Requests for development
app.use(express.json());
app.use(cors());

const multer = require("multer");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const jwt = require("jsonwebtoken");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", upload.none(), async (req, res) => {
  // req.body for form
  // console.log(req);
  // console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  console.log(username, password, email);
  // check if the username is inside the users database
  const userExists = await User.exists({ username: username });
  const emailExists = await User.exists({ email: email });
  if (userExists) {
    // if the username is already taken, return an error
    console.log("UsernameExistsError!");
    // send error response
    return res.send({ status: "error", message: "Username already exists!" });
  } else if (emailExists) {
    // if the email is already taken, return an error
    console.log("EmailExistsError!");
    // send error response
    return res.send({ status: "error", message: "Email already exists!" });
  } else if (!username || !password || !email) {
    // if the username, password, or email is empty, return an error
    console.log("EmptyFieldError!");
    // send error response
    return res.send({ status: "error", message: "Please fill in all fields!" });
  } else {
    // create a new user account
    const user = new User({
      username: username,
      password: password,
      email: email,
      accountType: "user",
      profilePicture: {
        buffer: null,
        mimetype: null,
      },
      bio: null,
      theme: null,
      followers: [],
      following: [],
    });
    user.save();
    // send success response
    return res.send({
      status: "success",
      message: "User account created successfully!",
    });
  }
});

// router.get('/test', upload.none(), async (req, res) => {
// 	console.log(req.body.test);
// 	res.send("Hello World!");
// });

router.get("/fetchUser", upload.none(), async (req, res) => {
  try {
    const username = req.query.username;
    console.log(username);
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const userInfo = {
      username: user.username,
      email: user.email,
      accountType: user.accountType,
      profilePicture: user.profilePicture,
      bio: user.bio,
      theme: user.theme,
      followers: user.followers,
      following: user.following,
    };

    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", upload.none(), async (req, res) => {
  console.log(req.body);
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

	  changableFields = ["bio", "theme", "accountType", "email", "password", "profilePicture"];
  
	  // Update the fields
	  for (const field in req.body) {
		if (!changableFields.includes(field)) {
		  continue;
		}
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
  
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


router.get("/viewProfilePicture", async (req, res) => {
  try {
    const { username } = req.query;
    // console.log(username);

    // Find the user by username
    const user = await User.findOne({ username: username });

    if (!user) {
      console.log("User not found!");
      return res.status(404).json({ message: "User not found!" });
    }

	let {buffer, mimetype} = user.profilePicture;

	// console.log(buffer);


    // if (!user.profilePicture || !user.profilePicture.buffer) {
    // 	return res.status(404).json({ message: "Profile picture not found!" });
    // }

	// Set the response headers
	if (!mimetype) {
		mimetype = "image/jpeg";
	}

	res.set("Content-Type", mimetype);

    // Send the profile picture buffer as the response
    res.status(200).send(buffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetchUserPosts", upload.none(), async (req, res) => {
  const username = req.query.username;
  const sender = req.query.sender;

  const user = await User.findOne({ username: username }).select(
    "accountType follower"
  );
  if (!user) {
    return res
      .status(404)
      .json({ status: "error", message: "Username does not exist!" });
  }

    //if user accountType is private, and the sender is not a follower of user, return an error
    if (user.accountType === "private" && (!user.follower || !user.follower.includes(sender) ) 
	&& sender !== username && sender !== "admin") {
        return res.status(403).json({ status: "error", message: "User account is private!" });
    }

  const posts = await Post.find({ username: username });

  if (!posts) {
    return res
      .status(404)
      .json({ status: "error", message: "User has no posts!" });
  }

  res
    .status(200)
    .json({ status: "success", message: "User posts fetched!", posts: posts });
});

router.get("/viewFollowers", async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Get the followers list
    const { followers } = user;

    // Filter out users which have been deleted
    const updatedFollowers = [];
    for (let i = 0; i < followers.length; i++) {
      const followerUser = await User.findOne({ username: followers[i] });
      if (followerUser) {
        updatedFollowers.push(followers[i]);
      }
    }

    // Update the user's followers list in the database
    user.followers = updatedFollowers;
    await user.save();

    // Map followers list to objects containing username and profile picture
    const followerUsers = await Promise.all(
      updatedFollowers.map(async (followerUsername) => {
        const followerUser = await User.findOne({
          username: followerUsername,
        }).select("username profilePicture");
        return followerUser;
      })
    );

    res.status(200).json(followerUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/viewFollowing", async (req, res) => {
  try {
    const { username } = req.query;
    console.log(username);
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Get the following list
    const { following } = user;

    // Filter out users which have been deleted
    const updatedFollowing = [];
    for (let i = 0; i < following.length; i++) {
      const followingUser = await User.findOne({ username: following[i] });
      if (followingUser) {
        updatedFollowing.push(following[i]);
      }
    }

    // Update the user's following list in the database
    user.following = updatedFollowing;
    await user.save();

    // Map following list to objects containing username and profile picture
    const followingUsers = await Promise.all(
      updatedFollowing.map(async (followingUsername) => {
        const followingUser = await User.findOne({
          username: followingUsername,
        }).select("username profilePicture");
        return followingUser;
      })
    );

    res.status(200).json(followingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/searchUsers", upload.none(), async (req, res) => {
  try {
    const { username, searchTerm } = req.query;

    // Find the user by username
    const user = await User.findOne({ username }).select("following followers");

    if (!user) {
      return res.status(404).json({ message: "Search user not found!" });
    }

    const followingList = user.following;
    const followerList = user.followers;
    console.log(followingList);
    console.log(followerList);

    // Filter users which have the search term in their username
    const matchedUsers = await User.find({
      username: {
        $regex: searchTerm,
        $options: "i",
      },
    }).select("username");
    const matchedUsernames = matchedUsers.map((user) => user.username);

    console.log(matchedUsers);

    // Prioritize users from the searcher's following and follower lists
    const prioritizedUsers = [
      username,
      ...followingList,
      ...followerList,
    ].filter((user) => matchedUsernames.includes(user));
    console.log(prioritizedUsers);
    const otherUsers = matchedUsernames.filter(
      (user) => !prioritizedUsers.includes(user)
    );

    // Combine the prioritized and other users into a single list
    const searchResultList = [...prioritizedUsers, ...otherUsers];

    const searchResults = await Promise.all(
      searchResultList.map(async (searchResult) => {
        const user = await User.findOne({ username: searchResult }).select(
          "username profilePicture"
        );
        return user;
      })
    );

    res.status(200).json(searchResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.get("/fetchAllUsers", async (req, res) => {
// 	const users = await User.find();
// 	res.status(200).json(users);
// })

// router.get("/fetchAllUsernames", async (req, res) => {
// 	const users = await User.find();
// 	const usernames = users.map(user => user.username);
// 	res.status(200).json(usernames);
// })

router.put("/resetFollows", upload.none(), async (req, res) => {
  try {
    users = await User.find().select("followers following");
    users.forEach(async (user) => {
      user.followers = [];
      user.following = [];
      await user.save();
    });
    res.status(200).json({ message: "Follows reset!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
