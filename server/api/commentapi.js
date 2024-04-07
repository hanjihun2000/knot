const express = require("express");
const multer = require("multer");
const cors = require('cors');
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

router.get("/fetchComments", upload.none(), async (req, res) => {
	try {
		// console.log(req.query)
		const postId = req.query.postId;
		if (!postId) {
			return res.status(400).send({ status: "error", message: "Post ID not found!" });
		}
		const commentsQuery = await Post.findOne({ postId: postId }).select("comments");
		const comments = commentsQuery.comments;
		return res.status(200).send({ status: "success", message: comments });
	} catch (err) {
		console.error(err);
		return res.status(400).send({ status: "error", message: "Internal Server Error!" });
	}
});

router.post("/createComment", upload.none(), async (req, res) => {
	try {
		// console.log(req.body)
		const {postId, username, text} = req.body;
		if (!postId || !username || !text) {
			return res.status(400).send({ status: "error", message: "Please fill in all fields!" });
		}

		// if username does not exist in the database, return an error
		if (!await User.exists({ username: username })) {
			return res.status(404).send({ status: "error", message: "Username does not exist!" });
		}

		// if post exists fetch post comments
		const postExists = await Post.exists({ postId: postId });
		if (!postExists) {
			return res.status(404).send({ status: "error", message: "Post does not exist!" });
		}

		const postComments = await Post.findOne({ postId:
			postId }).select("comments");
		const comments = postComments.comments;

		// generate comment ID
		let id;
		do {
			id = Math.floor(Math.random() * 1000000000);
		} while (comments.some(comment => comment.commentId === id));

		const comment = new Comment({
			postId: postId,
			commentId: id,
			username: username,
			text: text,
			likeDislike: [[], []],
			isReported: false
		});

		//push to array on database
		await Post.updateOne({ postId: postId }, { $push: { comments: comment } });

		return res.status(200).send({ status: "success", message: "Comment created!" });
	} catch (err) {
		console.error(err);
		return res.status(400).send({ status: "error", message: "Internal Server Error!" });
	}
});

// router.put("/likeDislikeComment", upload.none(), async (req, res) => {
// 	try {
// 	  const { postId, commentId, username, isLike, isUndo} = req.body;
// 	  const like = isLike === "true";
// 	  const undo = isUndo === "true";

// 	  console.log(postId, commentId, username, isLike, isUndo)


// 	  if (!postId || !commentId || !username || !isLike || !isUndo) {
// 		return res.status(400).send({ status: "error", message: "Please provide all required fields!" });
// 	  }
  
// 	  // Check if the user exists in the database
// 	  if (!await User.exists({ username: username })) {
// 		return res.status(404).send({ status: "error", message: "User does not exist!" });
// 	  }
  
// 	  // get post
// 	  const post = await Post.findOne({
// 		postId: postId
// 	  });


  
// 	  return res.status(200).send({ status: "success", message: "Comment like/dislike updated successfully!" });
// 	} catch (err) {
// 	  console.error(err);
// 	  return res.status(500).send({ status: "error", message: "Internal Server Error!" });
// 	}
//   });

module.exports = router;
