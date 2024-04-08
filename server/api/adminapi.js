const express = require("express");
const app = express();
const cors = require('cors');
// Enable All CORS Requests for development
app.use(express.json())
app.use(cors());

const multer = require("multer");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

const upload = multer({ storage: multer.memoryStorage() });

router.get('/listUsers', upload.none(), async (req, res) => {
    try {
        const users = await User.find();
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

router.delete("/deleteUser", upload.none(), async (req, res) => {
	try {
		const username = req.query.username;
		const user = await User.findOne({
			username: username
		});
		if (!user) {
			return res.status(404).json({
				message: "User not found!"
			});
		}
		if (user.accountType === "admin") {
			return res.status(403).json({
				message: "Cannot delete admin account!"
			});
		}
        //delete all posts made by user
        await Post.deleteMany({ username: username});
        //delete all comments made by user
        await Comment.deleteMany({ username: username});
		await User.deleteOne({ username: username });
		res.status(200).json({
			message: "User deleted!"
		});
	} catch (error) {
		res.status(500).json({
			message: error.message
		});
	}
});


module.exports = router;
