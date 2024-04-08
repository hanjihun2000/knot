const express = require("express");
const cors = require('cors');
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const app = express();
app.use(express.json());
app.use(cors());

const User = require("../models/user");
const Post = require("../models/post");

router.post("/createPost", upload.single('media'), async (req, res) => {
    // const username = req.body.username;
    // const title = req.body.title;
    // const text = req.body.text;
    // const buffer = req.file.buffer;
    // const mimetype = req.file.mimetype;

    const { username, title, text } = req.body;
    // Access the file information through req.file
    const buffer = req.file ? req.file.buffer : null;
    const mimetype = req.file ? req.file.mimetype : null;
    
    let id;
    // generate a postId that is unique
    do {
        id = Math.floor(Math.random() * 1000000000);
    } while (await Post.exists({ postId: id }));

    const postId = id;

    // do some data type checking here if needed

    if (username === "") {
        return res.status(400).json({ status: "error", message: "Username is required!" });
    }

    // if username does not exist in the database, return an error
    if (!await User.exists({ username: username })) {
        return res.status(404).json({ status: "error", message: "Username does not exist!" });
    }

    if (title === "") {
        return res.status(400).json({ status: "error", message: "Title is required!" });
    }


    const post = new Post({
        postId: postId,
        username: username,
        title: title,
        text: text,
        // add file, if no file return empty buffer and empty string mimetype
        media: buffer && mimetype ? { buffer: buffer, mimetype: mimetype } : null,
        likeDislike: [[], []], // [[username who likes a post], [username who dislikes a post]]
        comments: [],
        IsReported: false
    });


    console.log(post)


    post.save().then(savedPost => {
        res.status(201).json({ status: "success", message: "Post created successfully!", postId: savedPost.postId });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ status: "error", message: "Post creation failed!" });
    });
})

router.post("/editPost", upload.none(), async (req, res) => {
    const postId = req.body.postId;
    const attribute = req.body.attribute;
    const value = req.body.value;
    const post = await Post.findOne({ postId: postId });

    if (!post) {
        return res.status(404).json({ status: "error", message: "Post does not exist!" });
    }

    // if the post exists, update the attribute with the new value
    if (attribute === "title") {
        post.title = value;
        await post.save();
    } else if (attribute === "text") {
        post.text = value;
        await post.save();
    } else {
        return res.status(400).json({ status: "error", message: "Invalid attribute!" });
    }
    res.status(201).json({ status: "success", message: "Post updated successfully!" });
});

router.post("/deletePost", upload.none(), async (req, res) => {
    const postId = req.body.postId;
    const post = await Post.findOne({ postId: postId });

    if (!post) {
        return res.status(404).json({ status: "error", message: "Post does not exist!" });
    }

    // if the post exists, delete the post
    post.deleteOne().then(() => {
        res.status(200).json({ status: "success", message: "Post deleted successfully!" });
    }).catch((err) => {
        res.status(500).json({ status: "error", message: "Post deletion failed!" });
    });
});

router.post("/sharePost",  async (req, res) => {
    const postId = req.body.postId;
    const username = req.body.username;
    const post = await Post.findOne({ postId: postId });

    if (!post) {
        return res.status(404).json({ status: "error", message: "Post does not exist!" });
    }
    
    // create a new post with the same information as the original post
});

router.get("/fetchAllPostIds", upload.none(), async (req, res) => {
    const posts = await Post.find().select("postId");
    res.status(200).json({ status: "success", message: "All post IDs fetched!", postIds: posts });
});

router.get("/fetchPost", upload.none(), async (req, res) => {
    console.log(req.query)
    const postId = req.query.postId;
    const post = await Post.findOne({ postId: postId });

    if (!post) {
        return res.status(404).json({ status: "error", message: "Post does not exist!" });
    }

    // send the post information back to the client
    const postInfo = {
        postId: post.postId,
        username: post.username,
        title: post.title,
        text: post.text,
        media: post.media,
        likeDislike: post.likeDislike,
        comments: post.comments,
        IsReported: post.IsReported
    };
    res.status(200).json(postInfo);
});

router.post("/likeDislikePost", upload.none(), async (req, res) => {
    const postId = req.body.postId;
    const username = req.body.username;
    const action = req.body.action;
    const post = await Post.findOne({ postId: postId });

    if (!post) {
        return res.status(404).json({ status: "error", message: "Post does not exist!" });
    }

    // if the post exists, update the likeDislike array with the username
    // likeDislike[0] is the array of usernames who liked the post
    // likeDislike[1] is the array of usernames who disliked the post
    if (action == "like") {
        post.likeDislike[0].push(username);
        post.save().then(() => {
            res.status(200).json({ status: "success", message: "Post liked successfully!" });
        }).catch((err) => {
            res.status(500).json({ status: "error", message: "Post like failed!" });
        });
    } else if (postExists && action == "dislike") {
        post.likeDislike[1].push(username);
        post.save().then(() => {
            res.status(200).json({ status: "success", message: "Post disliked successfully!" });
        }).catch((err) => {
            res.status(500).json({ status: "error", message: "Post dislike failed!" });
        });
    }
});

router.post("/reportPost", upload.none(), async (req, res) => {
    const postId = req.body.postId;
    const post = await Post.findOne({ postId: postId });

    if (!post) {
        return res.status(404).json({ status: "error", message: "Post does not exist!" });
    }

    // if the post exists, set the IsReported attribute to true
    post.IsReported = true;
    post.save().then(() => {
        res.status(200).json({ status: "success", message: "Post reported successfully!" });
    }).catch((err) => {
        res.status(500).json({ status: "error", message: "Post report failed!" });
    });
});

router.get("/searchPosts", upload.none(), async (req, res) => {
    // return a list of postIds that contain the keyword in the title
    const keyword = req.body.keyword;
    const postsSearchedByTitle = await Post.find({ title: { "$regex": keyword, "$options": "i" } });
    const postsSearchedByText = await Post.find({ text: { "$regex": keyword, "$options": "i" } });
    // *** need to implement this logic ***
    const postIds = [];

    if (!postsSearchedByTitle && !postsSearchedByText) {
        return res.status(404).json({ status: "error", message: "No post found!" });
    }

    // send a list of postIds back to the client
    // post searched by title will be displayed first, followed by posts searched by text
    postsSearchedByTitle.forEach(element => {
        postIds.push(element.postId);
    });
    postsSearchedByText.forEach(element => {
        postIds.push(element.postId);
    });
    res.status(200).json({ status: "success", message: "Posts found!", postIds: postIds });
});

module.exports = router;
