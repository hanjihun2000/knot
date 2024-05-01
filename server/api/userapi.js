/*
 * This section of the code imports necessary modules for the application.
 */
var express = require("express");
var cors = require("cors");
var multer = require("multer");
var router = express.Router();
var User = require("../models/user");
var Post = require("../models/post");
var fs = require("fs");
var path = require("path");
var app = express();
var upload = multer({ storage: multer.memoryStorage() });
app.use(express.json());
app.use(cors());

/*
 * This is a POST route at "/register" for user registration.
 */
router.post("/register", upload.none(), async (req, res) => {
  // Extract the registration details from the request body
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const userExists = await User.exists({ username: username });
  const emailExists = await User.exists({ email: email });
  // Check whether the registration details are valid
  if (userExists) {
    return res.send({ status: "error", message: "Username already exists!" });
  } else if (emailExists) {
    return res.send({ status: "error", message: "Email already exists!" });
  } else if (!username || !password || !email) {
    return res.send({ status: "error", message: "Please fill in all fields!" });
  } else {
    // Set default profile picture for new registered users
    // Read the default profile picture from the file system
    const defaultProfilePicturePath = path.join(
      __dirname,
      "../defaultProfilePicture.png"
    );
    const defaultProfilePictureData = fs.readFileSync(
      defaultProfilePicturePath
    );
    const defaultProfilePictureBase64 =
      defaultProfilePictureData.toString("base64");
    const profilePictureBuffer = Buffer.from(
      defaultProfilePictureBase64,
      "base64"
    );
    // Create a new user with the registration details
    const user = new User({
      username: username,
      password: password,
      email: email,
      accountType: "user",
      profilePicture: {
        buffer: profilePictureBuffer,
        mimetype: "image/png",
      },
      bio: null,
      theme: null,
      followers: [],
      following: [],
    });
    user.save();
    return res.send({
      status: "success",
      message: "User account created successfully!",
    });
  }
});

/*
 * This is a GET route at "/fetchUser" that fetches a user's information based on the username provided in the query parameters.
 */
router.get("/fetchUser", upload.none(), async (req, res) => {
  try {
    // Extract the username from the query parameters
    const username = req.query.username;
    const user = await User.findOne({ username: username });
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    // Extract the user information to be sent back
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
    // Handle any errors that occur during the process
    res.status(500).json({ message: error.message });
  }
});

/*
 * This is a POST route at "/login" for user login.
 */
router.post("/login", upload.none(), async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if the username exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // Check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // If the username and password are correct, send a success message
    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*
 * This is a POST route at "/logout" for user logout.
 */
router.post("/logout", upload.none(), (req, res) => {
  // Perform the logout operation
  try {
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*
 * This is a PUT route for editing a user's profile.
 */
router.put(
  "/editUserProfile",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { username } = req.body;
      // Find the user by username
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      // Define the fields that can be changed
      changableFields = [
        "bio",
        "theme",
        "accountType",
        "email",
        "password",
        "profilePicture",
      ];
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
          mimetype: req.file.mimetype,
        };
      }
      // Save the updated user
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/*
 * This is a GET route for viewing the profile picture of a specific user.
 */
router.get("/viewProfilePicture", async (req, res) => {
  try {
    const { username } = req.query;
    // Find the user by username
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    let { buffer, mimetype } = user.profilePicture;
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

/*
 * This is a GET route for fetching the posts of a specific user.
 */
router.get("/fetchUserPosts", upload.none(), async (req, res) => {
  try {
    // Extract the username and sender from the query parameters
    const username = req.query.username;
    const sender = req.query.sender;
    const user = await User.findOne({ username: username }).select(
      "accountType follower"
    );
    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Username does not exist!" });
    }
    //if user accountType is private, and the sender is not a follower of user, return an error
    if (
      user.accountType === "private" &&
      (!user.follower || !user.followers.includes(sender)) &&
      sender !== username &&
      sender !== "admin"
    ) {
      return res
        .status(403)
        .json({ status: "error", message: "User account is private!" });
    }
    const posts = await Post.find({ username: username });
    if (!posts) {
      return res
        .status(404)
        .json({ status: "error", message: "User has no posts!" });
    }
    return res.status(200).json({
      status: "success",
      message: "User posts fetched!",
      posts: posts,
    });
  } catch {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

/*
 *This is a GET route for viewing the list of followers of a specific user.
 */
router.get("/viewFollowers", async (req, res) => {
  try {
    // Extract the username from the query parameters
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

/*
 * This is a GET route for viewing the list of users that a specific user is following.
 */
router.get("/viewFollowing", async (req, res) => {
  try {
    // Extract the username from the query parameters
    const { username } = req.query;
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

/*
 * This is a GET route for searching users.
 */
router.get("/searchUsers", upload.none(), async (req, res) => {
  try {
    // Extract the search term from the query parameters
    const searchTerm = req.query.searchTerm;
    // Find users whose username matches the search term (case-insensitive)
    const matchedUsers = await User.find({
      username: {
        $regex: searchTerm,
        $options: "i",
      },
      accountType: {
        $in: ["user", "private"],
        $nin: ["admin"],
      },
    }).select("username profilePicture");
    // Check if there is no matched users found
    if (matchedUsers.length === 0) {
      return res.status(200).json({ status: true, message: "No users found!" });
    }
    // Map the matched users to an array of objects containing the username and profile picture
    const searchResult = matchedUsers.map((user) => ({
      username: user.username,
      profilePicture: user.profilePicture,
    }));
    return res.status(200).json(searchResult);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error.message);
    return res.status(500).json({ status: false, message: error.message });
  }
});

/*
 * This function is a route handler for the "/resetFollows" endpoint of the API.
 */
router.put("/resetFollows", upload.none(), async (req, res) => {
  try {
    // Find all users and reset their followers and following lists
    const users = await User.find().select("followers following");
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
