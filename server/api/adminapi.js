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
const Comment = require("../models/comment");

const upload = multer({ storage: multer.memoryStorage() });

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

router.get('/listUsernames', upload.none(), async (req, res) => {
    try {
        const users = await User.find().select("username");
        return res.status(200).send({ status: "success", message: users });
    } catch (err) {
        console.error(err);
        return res.status(400).send({ status: "error", message: "Internal Server Error!" });
    }
});

router.get('/listUserProfiles', upload.none(), async (req, res) => {
    // get name and profilePicture only
    try {
        const users = await User.find().select('username profilePicture');
        return res.status(200).send({ status: "success", message: users });
    } catch (err) {
        console.error(err);
        return res.status(400).send({ status: "error", message: "Internal Server Error!" });
    }
});

router.get('/listReportedUsers', upload.none(), async (req, res) => {
	try {
		//get usernames of reported posts
		const reportedPosts = await Post.find({ IsReported: true }).select('username');
		//get usernames of reported comments
		const reportedComments = await Comment.find({ IsReported: true }).select('username');
		const reportedUsers = [];
		//add usernames to reportedUsers
		reportedPosts.forEach(post => {
			if (!reportedUsers.includes(post.username)) {
				reportedUsers.push(post.username);
			}
		});
		reportedComments.forEach(comment => {
			if (!reportedUsers.includes(comment.username)) {
				reportedUsers.push(comment.username);
			}
		});

    //fetch user name and profile picture
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

router.delete("/deleteUser", upload.none(), async (req, res) => {
  try {
    const username = req.body.username;
    const user = await User.findOne({
      username: username,
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }
    if (user.accountType === "admin") {
      return res.status(403).json({
        message: "Cannot delete admin account!",
      });
    }
    //delete all posts made by user
    await Post.deleteMany({ username: username });
    //delete all comments made by user
    await Comment.deleteMany({ username: username });
    await User.deleteOne({ username: username });
    res.status(200).json({
      message: "User deleted!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

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

router.delete("/deleteComment", upload.none(), async (req, res) => {
  try {
    const postId = req.body.postId;
    const commentId = req.body.commentId;
    const comment = await Comment.findOneAndDelete({
      postId: postId,
      commentId: commentId,
    });
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

router.post("/removePostReport", upload.none(), async (req, res) => {
  try {
    const postId = req.body.postId;
    const post = await Post.findOne({
      postId: postId,
    });
    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
      });
    }
    post.IsReported = false;
    await post.save();
    res.status(200).json({ message: "Report removed!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/removeCommentReport", upload.none(), async (req, res) => {
  try {
    const postId = req.body.postId;
    const commentId = req.body.commentId;
    const comment = await Comment.findOne({
      postId: postId,
      commentId: commentId,
    });
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found!",
      });
    }
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
