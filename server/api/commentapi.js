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
		const {postId} = req.query;
		if (!postId) {
			return res.status(400).send({ status: "error", message: "Please provide all required fields!" });
		}

		// if post exists fetch post comments
		const postExists = await Post.exists({ postId: postId });
		if (!postExists) {
			return res.status(404).send({ status: "error", message: "Post does not exist!" });
		}

		//query comment database
		const comments = await Comment.find({ postId: postId });
		
		return res.status(200).send({ status: "success", message: comments });
	} catch (err) {
		console.error(err);
		return res.status(400).send({ status: "error", message: "Internal Server Error!" });
	}
});

router.get("/fetchAllCommentIds", upload.none(), async (req, res) => {
	try {

		//query comment database
		const commentQuery = await Comment.find().select('commentId');
		const commentIds = commentQuery.map(comment => comment.commentId);
		
		return res.status(200).send({ status: "success", message: commentIds });
	} catch (err) {
		console.error(err);
		return res.status(400).send({ status: "error", message: "Internal Server Error!" });
	}
});


router.post("/createComment", upload.none(), async (req, res) => {
	try {

		console.log(req.body)
		
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

		// generate comment ID
		let id;
		do {
			id = Math.floor(Math.random() * 1000000000);
		} while (await Comment.exists({ commentId: id }));

		const comment = new Comment({
			postId: postId,
			commentId: id,
			username: username,
			text: text,
			likes: [],
			dislikes: [],
			IsReported: false
		});

		comment.save();
		return res.status(200).send({ status: "success", message: "Comment created successfully! ID: " + id });
	} catch (err) {
		console.error(err);
		return res.status(400).send({ status: "error", message: "Internal Server Error!" });
	}
});

function addUsername(array, username) {
    array.push(username);
}

function removeUsername(array, username) {
    const index = array.indexOf(username);
    if (index > -1) {
        array.splice(index, 1);
    }
}

router.put('/likeDislikeComment', upload.none(), async (req, res) => {
	try {
		const {postId, commentId, username, isLike, isUndo} = req.body;
		like = isLike === "true";
		undo = isUndo === "true";

		if (!postId || !commentId || !username || !isLike || !isUndo) {
			return res.status(400).send({ status: "error", message: "Please fill in all fields!" });
		}

		// if username does not exist in the database, return an error
		if (!await User.exists({ username: username })) {
			return res.status(404).send({ status: "error", message: "Username does not exist!" });
		}

		// fetch comment by commentID
		const comment = await Comment.findOne({ commentId: commentId });
		if (!comment) {
			return res.status(404).send({ status: "error", message: "Comment does not exist!" });
		}

		console.log(comment)

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

		console.log(comment)

		comment.save();

		return res.status(200).send({ status: "success", message: message });
	} catch (err) {
		console.error(err);
		return res.status(400).send({ status: "error", message: "Internal Server Error!" });
	}

});

router.delete("/deleteComment", upload.none(), async (req, res) => {
	try {
		const {commentId} = req.query;
		if (!commentId) {
			return res.status(400).send({ status: "error", message: "Please provide all required fields!" });
		}

		// fetch comment by commentID
		const comment = await Comment.findOne({ commentId: commentId });
		if (!comment) {
			return res.status(404).send({ status: "error", message: "Comment does not exist!" });
		}

		await Comment.deleteOne({ commentId: commentId });

		console.log(await Comment.findOne({ commentId: commentId }));

		return res.status(200).send({ status: "success", message: "Comment deleted!" });
	} catch (err) {
		console.error(err);
		return res.status(400).send({ status: "error", message: "Internal Server Error!" });
	}
});

router.put("/reportComment", upload.none(), async (req, res) => {
	try {
		const {commentId} = req.query;
		const comment = await Comment.findOne({ commentId: commentId });

        if (!comment) {
            return res.status(404).json({ status: "error", message: "Comment does not exist!" });
        }

        // if the comment exists, set the IsReported attribute to true
        comment.IsReported = true;
        comment.save().then(() => {
            res.status(200).json({ status: "success", message: "Comment reported successfully!" });
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "An error occurred while reporting the comment!" });
    }
});


module.exports = router;
