/*
 * This section of the code imports necessary modules for the application.
 */
var express = require("express");
var multer = require("multer");
var cors = require("cors");
var upload = multer({ storage: multer.memoryStorage() });
var router = express.Router();
var User = require("../models/user");
var Follow = require("../models/follow");
var app = express();
app.use(express.json());
app.use(cors());

router.post("/makeFollowRequest", upload.none(), async (req, res) => {
  try {
    const { sender, receiver } = req.body;
    // check if all fields are filled, otherwise return an error
    if (!sender || !receiver) {
      return res
        .status(400)
        .send({ status: "error", message: "Please fill in all fields!" });
    }
    if (sender === receiver) {
      return res
        .status(400)
        .send({ status: "error", message: "Cannot follow yourself!" });
    }
    // check if sender and receiver are in the database
    const senderExists = await User.exists({ username: sender });
    const receiverExists = await User.exists({ username: receiver });
    if (!senderExists) {
      return res
        .status(400)
        .send({ status: "error", message: "Sender does not exist!" });
    } else if (!receiverExists) {
      return res
        .status(400)
        .send({ status: "error", message: "Receiver does not exist!" });
    }
    //check if sender is already following receiver
    const followingQuery = await User.findOne({ username: sender }).select(
      "following"
    );
    const following = followingQuery.following;
    if (following.includes(receiver)) {
      return res
        .status(400)
        .send({ status: "error", message: "Already following this user!" });
    }
    //check if request is already in the database
    if (await Follow.exists({ sender: sender, receiver: receiver })) {
      return res
        .status(400)
        .send({ status: "error", message: "Follow request already exists!" });
    }
    const follow = new Follow({
      sender: sender,
      receiver: receiver,
    });
    //check if this follow request already exists
    const followExists = await Follow.exists({
      sender: sender,
      receiver: receiver,
    });
    if (followExists) {
      return res
        .status(200)
        .send({ status: "success", message: "Follow request already exists!" });
    }
    follow.save();
    return res
      .status(200)
      .send({ status: "success", message: "Follow request sent!" });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ status: "error", message: "Internal Server Error!" });
  }
});

router.get("/viewAllFollowRequests", upload.none(), async (req, res) => {
  try {
    // get all follow requests
    const followRequests = await Follow.find();
    return res.status(200).send({ status: "success", message: followRequests });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ status: "error", message: "Internal Server Error!" });
  }
});

router.get("/viewFollowRequests", upload.none(), async (req, res) => {
  try {
    const receiver = req.query.username;
    // check if a user with the given username exists
    const userExists = await User.exists({ username: receiver });
    if (!userExists) {
      return res
        .status(400)
        .send({ status: "error", message: "User does not exist!" });
    }
    const followRequests = await Follow.find({ receiver: receiver });
    //get username and profile picture of senders
    const senders = await Promise.all(
      followRequests.map(async (followRequest) => {
        const sender = await User.findOne({
          username: followRequest.sender,
        }).select("username profilePicture");
        return sender;
      })
    );
    return res.status(200).send({ status: "success", message: senders });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ status: "error", message: "Internal Server Error!" });
  }
});

// Route to handle a follow request (either accept or delete)
router.delete("/handleFollowRequest", upload.none(), async (req, res) => {
  try {
    const { sender, receiver, accept } = req.query;
    // check if there is a follow request from sender to receiver in the database
    const followExists = await Follow.exists({
      sender: sender,
      receiver: receiver,
    });
    // If the follow request does not exist, return an error
    if (!followExists) {
      return res
        .status(400)
        .send({ status: "error", message: "Follow request does not exist!" });
    }
    // If the follow request exists, delete it since the request has been handled
    // If accept is false, no further action is needed
    await Follow.deleteOne({ sender: sender, receiver: receiver });
    if (accept === "false") {
      return res
        .status(200)
        .send({ status: "success", message: "Follow request deleted!" });
    }
    // If accept is true, add the sender to the receiver's followers and the receiver to the sender's following
    const senderUser = await User.findOne({ username: sender });
    const receiverUser = await User.findOne({ username: receiver });
    senderUser.following.push(receiver);
    receiverUser.followers.push(sender);
    await senderUser.save();
    await receiverUser.save();
    return res
      .status(200)
      .send({ status: "success", message: "Follow request accepted!" });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ status: "error", message: "Internal Server Error!" });
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
