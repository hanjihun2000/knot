/*
 * This section of the code imports necessary modules for the application.
 */
var express = require("express");
var app = express();
var cors = require("cors");
var multer = require("multer");
var router = express.Router();
var User = require("../models/user");
var Post = require("../models/post");
var Comment = require("../models/comment");
var Follow = require("../models/follow").default;
var upload = multer({ storage: multer.memoryStorage() });
app.use(express.json());
app.use(cors());

// Fetch all users
router.get("/listUsers", upload.none(), async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).send({ status: "success", message: users });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ status: "error", message: "Internal Server Error!" });
  }
});

// Fetch all users' usernames
router.get("/listUsernames", upload.none(), async (req, res) => {
  try {
    const users = await User.find().select("username");
    return res.status(200).send({ status: "success", message: users });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ status: "error", message: "Internal Server Error!" });
  }
});

// Fetch all users' usernames and profile pictures
// The difference between above function is that this API returns both username and profilePicture
router.get("/listUserProfiles", upload.none(), async (req, res) => {
  try {
    const users = await User.find().select("username profilePicture");
    return res.status(200).send({ status: "success", message: users });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ status: "error", message: "Internal Server Error!" });
  }
});

// Fetch all reported users (users who have reported posts or comments)
router.get("/listReportedUsers", upload.none(), async (req, res) => {
  try {
    //get usernames of reported posts
    const reportedPosts = await Post.find({ IsReported: true }).select(
      "username"
    );
    //get usernames of reported comments
    const reportedComments = await Comment.find({ IsReported: true }).select(
      "username"
    );
    const reportedUsers = [];
    //add usernames to reportedUsers
    reportedPosts.forEach((post) => {
      if (!reportedUsers.includes(post.username)) {
        reportedUsers.push(post.username);
      }
    });
    reportedComments.forEach((comment) => {
      if (!reportedUsers.includes(comment.username)) {
        reportedUsers.push(comment.username);
      }
    });
    //fetch username and profile picture
    const users = await User.find({ username: { $in: reportedUsers } }).select(
      "username profilePicture"
    );
    return res.status(200).send({ status: "success", message: users });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ status: "error", message: "Internal Server Error!" });
  }
});

// Fetch all reported posts
// Queries from the report database to return a list of postIDs (with post contents) that have been reported by the users.
router.get("/listReportedPosts", upload.none(), async (req, res) => {
  try {
    const reportedPosts = await Post.find({ IsReported: true });
    const reportedPostsList = [];
    reportedPosts.forEach((post) => {
      const reportedPost = {
        postId: post.postId,
        username: post.username,
        title: post.title,
        text: post.text,
        media: post.media,
        likes: post.likes,
        dislikes: post.dislikes,
      };
      reportedPostsList.push(reportedPost);
    });
    // return list of reported posts
    return res
      .status(200)
      .send({ status: "success", message: reportedPostsList });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ status: "error", message: "Internal Server Error!" });
  }
});

// Fetch all reported comments
// Queries from the report database to return a list of reported postIDs and commentIDs corresponding to each comment.
router.get("/listReportedComments", upload.none(), async (req, res) => {
  try {
    const reportedComments = await Comment.find({ IsReported: true });
    const reportedCommentsList = [];
    reportedComments.forEach((comment) => {
      const reportedComment = {
        postId: comment.postId,
        commentId: comment.commentId,
        username: comment.username,
        text: comment.text,
        likes: comment.likes,
        dislikes: comment.dislikes,
      };
      reportedCommentsList.push(reportedComment);
    });
    // return list of reported comments
    return res
      .status(200)
      .send({ status: "success", message: reportedCommentsList });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ status: "error", message: "Internal Server Error!" });
  }
});

// Delete a user
router.delete("/deleteUser", upload.none(), async (req, res) => {
  try {
    const username = req.body.username;
    const user = await User.findOne({
      username: username,
    });
    // If the user does not exist, return an error
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }
    // If the user's accountType is an admin, return an error
    if (user.accountType === "admin") {
      return res.status(403).json({
        message: "Cannot delete admin account!",
      });
    }
    //delete all posts made by user
    await Post.deleteMany({ username: username });
    //delete all comments made by user
    await Comment.deleteMany({ username: username });
    //delete follow requests containing deleted user
    await Follow.deleteMany({ sender: username });
    await Follow.deleteMany({ receiver: username });
    await User.deleteOne({ username: username });
    // return success message
    res.status(200).json({
      message: "User deleted!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Delete a post
router.delete("/deletePost", upload.none(), async (req, res) => {
  try {
    const postId = req.body.postId;
    const post = await Post.findOneAndDelete({ postId: postId });
    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
      });
    }
    res.status(200).json({
      message: "Post deleted!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Delete a comment
router.delete("/deleteComment", upload.none(), async (req, res) => {
  try {
    const postId = req.body.postId;
    const commentId = req.body.commentId;
    // Find the comment and delete it
    const comment = await Comment.findOneAndDelete({
      postId: postId,
      commentId: commentId,
    });
    // If the comment does not exist, return an error
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found!",
      });
    }
    res.status(200).json({
      message: "Comment deleted!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Remove a report from a post since it was a false report
router.post("/removePostReport", upload.none(), async (req, res) => {
  try {
    const postId = req.body.postId;
    const post = await Post.findOne({
      postId: postId,
    });
    // If the post does not exist, return an error
    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
      });
    }
    // Set the IsReported attribute to false
    post.IsReported = false;
    await post.save();
    res.status(200).json({ message: "Report removed!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove a report from a comment since it was a false report
router.post("/removeCommentReport", upload.none(), async (req, res) => {
  try {
    const postId = req.body.postId;
    const commentId = req.body.commentId;
    const comment = await Comment.findOne({
      postId: postId,
      commentId: commentId,
    });
    // If the comment does not exist, return an error
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found!",
      });
    }
    // Set the IsReported attribute to false
    comment.IsReported = false;
    await comment.save();
    res.status(200).json({
      message: "Report removed!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
