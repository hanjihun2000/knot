const express = require("express");
const multer = require("multer");
const cors = require('cors');
const router = express.Router();
const User = require("../models/user");
const Follow = require("../models/follow");
const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

router.get("/test", upload.none(), async (req, res) => {
	console.log(req.body.test);
	res.send("Hello World!");
});

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

		//check if sender is already following receiver
		const followingQuery = await User.findOne({ username: sender }).select('following');
		const following = followingQuery.following;
		if (following.includes(receiver)) {
			return res.status(400).send({ status: "error", message: "Already following this user!" });
		}

		//check if request is already in the database
		if (await Follow.exists({ sender: sender, receiver: receiver })) {
			return res.status(400).send({ status: "error", message: "Follow request already exists!" });
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
		return res.status(200).send({ status: "success", message: "Follow request sent!" });
	} catch (err) {
		console.error(err);
		return res.status(400).send({ status: "error", message: "Internal Server Error!" });
	}
});

router.get('/viewAllFollowRequests', upload.none(), async (req, res) => {
	try {
		const followRequests = await Follow.find();
		return res.status(200).send({ status: "success", message: followRequests });
	} catch (err) {
		console.error(err);
		return res.status(400).send({ status: "error", message: "Internal Server Error!" });
	}
});

router.get('/viewFollowRequests', upload.none(), async (req, res) => {
	try {
		const receiver = req.query.username;
		console.log(receiver);
		// check if a user
		const userExists = await User.exists({ username: receiver });
		if (!userExists) {
			return res.status(400).send({ status: "error", message: "User does not exist!" });
		}
		const followRequests = await Follow.find({ receiver: receiver });
		// //get usernames of senders
		// const senders = followRequests.map((followRequest) => followRequest.sender);

		//get username and profile picture of senders
		const senders = await Promise.all(
			followRequests.map(async (followRequest) => {
				const sender = await User.findOne({ username: followRequest.sender }).select('username profilePicture');
				return sender;
			}
		));
		
		return res.status(200).send({ status: "success", message: senders });
	} catch (err) {
		console.error(err);
		return res.status(400).send({ status: "error", message: "Internal Server Error!" });
	}
});

router.delete('/handleFollowRequest', upload.none(), async (req, res) => {
	try {
		const {sender, receiver, accept} = req.body;
		acceptBool = accept === "true";
		console.log(acceptBool)
		const followExists = await Follow.exists({ sender: sender, receiver: receiver });
		if (!followExists) {
			return res.status(400).send({ status: "error", message: "Follow request does not exist!" });
		}

		await Follow.deleteOne({ sender: sender, receiver: receiver });

		if (!acceptBool) {
			return res.status(200).send({ status: "success", message: "Follow request deleted!" });
		}
		
		const senderUser = await User.findOne({ username: sender });
		const receiverUser = await User.findOne({ username: receiver });
		senderUser.following.push(receiver);
		receiverUser.followers.push(sender);
		await senderUser.save();
		await receiverUser.save();
		return res.status(200).send({ status: "success", message: "Follow request accepted!" });

	} catch (err) {
		console.error(err);
		return res.status(400).send({ status: "error", message: "Internal Server Error!" });
	}
});



module.exports = router;
