/*
 * This section of the code imports necessary modules for the application.
 */
var express = require("express");
var multer = require("multer");
var cors = require("cors");
var router = express.Router();
var User = require("../models/user");
var Post = require("../models/post");
var Comment = require("../models/comment");
var app = express();
app.use(express.json());
app.use(cors());
var upload = multer({ storage: multer.memoryStorage() });

// Fetch all comments for a post
router.get("/fetchComments", upload.none(), async (req, res) => {
  try {
    const { postId } = req.query;
    if (!postId) {
      return res.status(400).send({
        status: "error",
        message: "Please provide all required fields!",
      });
    }
    // if post does not exist, return an error since comments cannot exist without a post
    const postExists = await Post.exists({ postId: postId });
    if (!postExists) {
      return res
        .status(404)
        .send({ status: "error", message: "Post does not exist!" });
    }
    // query comment database for comments with the given post ID
    const comments = await Comment.find({ postId: postId });
    return res.status(200).send({ status: "success", message: comments });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ status: "error", message: "Internal Server Error!" });
  }
});

// Fetch all comment IDs
router.get("/fetchAllCommentIds", upload.none(), async (req, res) => {
  try {
    // query comment database for all comment IDs
    const commentQuery = await Comment.find().select("commentId");
    const commentIds = commentQuery.map((comment) => comment.commentId);
    return res.status(200).send({ status: "success", message: commentIds });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ status: "error", message: "Internal Server Error!" });
  }
});

// Create a new comment
router.post("/createComment", upload.none(), async (req, res) => {
  try {
    const { postId, username, text } = req.body;
    // if any of the fields are empty, return an error
    if (!postId || !username || !text) {
      return res
        .status(400)
        .send({ status: "error", message: "Please fill in all fields!" });
    }
    // if username does not exist in the database, return an error
    if (!(await User.exists({ username: username }))) {
      return res
        .status(404)
        .send({ status: "error", message: "Username does not exist!" });
    }
    // if post exists, fetch post comments
    const postExists = await Post.exists({ postId: postId });
    if (!postExists) {
      return res
        .status(404)
        .send({ status: "error", message: "Post does not exist!" });
    }
    // generate comment ID and check if it already exists
    let id;
    do {
      id = Math.floor(Math.random() * 1000000000);
    } while (await Comment.exists({ commentId: id }));
    // create new comment
    const comment = new Comment({
      postId: postId,
      commentId: id,
      username: username,
      text: text,
      likes: [],
      dislikes: [],
      IsReported: false,
    });
    comment.save();
    return res.status(200).send({
      status: "success",
      message: "Comment created successfully! ID: " + id,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ status: "error", message: "Internal Server Error!" });
  }
});

// Helper function to add a username to an array
function addUsername(array, username) {
  array.push(username);
}

// Helper function to remove a username from an array
function removeUsername(array, username) {
  const index = array.indexOf(username);
  if (index > -1) {
    array.splice(index, 1);
  }
}

// Like/dislike a comment
router.put("/likeDislikeComment", upload.none(), async (req, res) => {
  try {
    const { postId, commentId, username, isLike, isUndo } = req.body;
    like = isLike === "true";
    undo = isUndo === "true";
    // if any of the fields are empty, return an error
    if (!postId || !commentId || !username || !isLike || !isUndo) {
      return res
        .status(400)
        .send({ status: "error", message: "Please fill in all fields!" });
    }
    // if username does not exist in the database, return an error
    if (!(await User.exists({ username: username }))) {
      return res
        .status(404)
        .send({ status: "error", message: "Username does not exist!" });
    }
    // fetch comment by commentID
    const comment = await Comment.findOne({ commentId: commentId });
    if (!comment) {
      return res
        .status(404)
        .send({ status: "error", message: "Comment does not exist!" });
    }
    let message = "";
    // process like/dislike
    if (like && !undo) {
      removeUsername(comment.dislikes, username);
      addUsername(comment.likes, username);
      message = "Comment liked!";
    } else if (!like && !undo) {
      removeUsername(comment.likes, username);
      addUsername(comment.dislikes, username);
      message = "Comment disliked!";
    } else if (undo) {
      removeUsername(comment.likes, username);
      removeUsername(comment.dislikes, username);
      message = "Comment like/dislike removed!";
    }
    comment.save();
    return res.status(200).send({ status: "success", message: message });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ status: "error", message: "Internal Server Error!" });
  }
});

// Delete a comment
router.delete("/deleteComment", upload.none(), async (req, res) => {
  try {
    const { commentId } = req.query;
    // if comment ID is not provided, return an error
    if (!commentId) {
      return res.status(400).send({
        status: "error",
        message: "Please provide all required fields!",
      });
    }
    // fetch comment by commentID
    const comment = await Comment.findOne({ commentId: commentId });
    if (!comment) {
      return res
        .status(404)
        .send({ status: "error", message: "Comment does not exist!" });
    }
    // delete comment
    await Comment.deleteOne({ commentId: commentId });
    return res
      .status(200)
      .send({ status: "success", message: "Comment deleted!" });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({ status: "error", message: "Internal Server Error!" });
  }
});

// Report a comment
router.put("/reportComment", upload.none(), async (req, res) => {
  try {
    const { commentId } = req.query;
    const comment = await Comment.findOne({ commentId: commentId });
    // if the comment does not exist, return an error
    if (!comment) {
      return res
        .status(404)
        .json({ status: "error", message: "Comment does not exist!" });
    }
    // if the comment exists, set the IsReported attribute to true
    comment.IsReported = true;
    comment.save().then(() => {
      res
        .status(200)
        .json({ status: "success", message: "Comment reported successfully!" });
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while reporting the comment!",
    });
  }
});

module.exports = router;
