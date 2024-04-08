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

router.get("/viewFollowing", async (req, res) => {
    try {
        const usernameParam = req.query.username;
        const user = await User.findOne({ username: usernameParam }).select("following");
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const updatedFollowing = await Promise.all(
            user.following.map(async (followingUsername) => {
                const followingUser = await User.findOne({ username: followingUsername }).select("username profilePicture");
                if (!followingUser) {
                    return null;
                }
                // Assuming profilePicture is stored in a way that can be directly sent to the client
                // Adjust the structure as needed based on how you store profile pictures
                return {
                    username: followingUser.username,
                    profilePicture: followingUser.profilePicture ? followingUser.profilePicture : 'path/to/default/image.png'
                };
            })
        );

        const filteredFollowing = updatedFollowing.filter(user => user !== null);

        // No need to save the user document here as you're not modifying the user itself, just querying related data
        res.status(200).json(filteredFollowing);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
