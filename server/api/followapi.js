const express = require("express");
const multer = require("multer");
const router = express.Router();
const User = require("../models/user");
const Follow = require("../models/follow");

const upload = multer({ storage: multer.memoryStorage() });

// router.get("/test", upload.none(), async (req, res) => {
// 	console.log(req.body.test);
// 	res.send("Hello World!");
// });

router.post("/makeFollowRequest", upload.none(), async (req, res) => {
	try {
		console.log(req.body)
		const {sender, receiver} = req.body;
		if (!sender || !receiver) {
			return res.status(400).send({ status: "error", message: "Please fill in all fields!" });
		}
		if (sender === receiver) {
			return res.status(400).send({ status: "error", message: "Cannot follow yourself!" });
		}
		// check if sender and receiver are in the database
		const senderExists = await User.exists({ username: sender });
		const receiverExists = await User.exists({ username: receiver });
		if (!senderExists) {
			return res.status(400).send({ status: "error", message: "Sender does not exist!" });
		} else if (!receiverExists) {
			return res.status(400).send({ status: "error", message: "Receiver does not exist!" });
		}

		const follow = new Follow({
			sender: sender,
			receiver: receiver
		});
		//check if this follow request already exists
		const followExists = await Follow.exists({ sender: sender, receiver: receiver });
		if (followExists) {
			return res.status(400).send({ status: "error", message: "Follow request already exists!" });
		}

		follow.save();
		return res.status(500).send({ status: "success", message: "Follow request sent!" });
	} catch (err) {
		console.error(err);
		return res.status(400).send({ status: "error", message: "Internal Server Error!" });
	}
});

router.get('/viewAllFollowRequests', upload.none(), async (req, res) => {
	try {
		const followRequests = await Follow.find();
		return res.status(500).send({ status: "success", message: followRequests });
	} catch (err) {
		console.error(err);
		return res.status(400).send({ status: "error", message: "Internal Server Error!" });
	}
});

router.get('/viewFollowRequests', upload.none(), async (req, res) => {
	try {
		const receiver = req.query.username;
		const followRequests = await Follow.find({ receiver: receiver });
		//get usernames of senders
		const senders = followRequests.map((followRequest) => followRequest.sender);
		return res.status(500).send({ status: "success", message: senders });
	} catch (err) {
		console.error(err);
		return res.status(400).send({ status: "error", message: "Internal Server Error!" });
	}
});

router.delete('/handleFollowRequest', upload.none(), async (req, res) => {
	try {
		const {sender, receiver, accept} = req.body;
		acceptBool = Boolean(accept);
		const followExists = await Follow.exists({ sender: sender, receiver: receiver });
		if (!followExists) {
			return res.status(400).send({ status: "error", message: "Follow request does not exist!" });
		}
		await Follow.deleteOne({ sender: sender, receiver: receiver });
		if (acceptBool) {
			const senderUser = await User.findOne({ username: sender });
			const receiverUser = await User.findOne({ username: receiver });
			senderUser.following.push(receiver);
			receiverUser.followers.push(sender);
			await senderUser.save();
			await receiverUser.save();
			return res.status(500).send({ status: "success", message: "Follow request accepted!" });
		}
		return res.status(500).send({ status: "success", message: "Follow request deleted!" });
	} catch (err) {
		console.error(err);
		return res.status(400).send({ status: "error", message: "Internal Server Error!" });
	}
});



module.exports = router;
