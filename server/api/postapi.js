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

router.post("/createPost", upload.single('file'), async (req, res) => {
    // const username = req.body.username;
    // const title = req.body.title;
    // const text = req.body.text;
    // const buffer = req.file.buffer;
    // const mimetype = req.file.mimetype;

    const {username, title, text, buffer, mimetype} = req.body;
    
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
        media: buffer && mimetype ? { buffer: buffer, mimetype: mimetype } : null,
        likes: [],
        dislikes: [],
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

router.delete("/deletePost", upload.none(), async (req, res) => {
    const postId = req.query.postId;
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
        //postId: post.postId,
        username: post.username,
        title: post.title,
        text: post.text,
        media: post.media,
        likes: post.likes,
        dislikes: post.dislikes,
        //IsReported: post.IsReported
    };
    res.status(200).json(postInfo);
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

router.put("/likeDislikePost", upload.none(), async (req, res) => {
    try {
        const {postId, username, isLike, isUndo} = req.body;

        if (!postId || !username || !isLike || !isUndo) {
            return res.status(400).json({ status: "error", message: "Please provide all required fields!" });
        }

        const userExists = await User.exists({ username: username });
        if (!userExists) {
            return res.status(404).json({ status: "error", message: "Username does not exist!" });
        }

        const like = isLike === "true";
        const undo = isUndo === "true";

        let update = {};
        let message = "";

        if (like && !undo) {
            update = {
                $pull: { dislikes: username },
                $addToSet: { likes: username }
            };
            message = "Post liked!";
        } else if (!like && !undo) {
            update = {
                $pull: { likes: username },
                $addToSet: { dislikes: username }
            };
            message = "Post disliked!";
        } else if (undo) {
            update = {
                $pull: { likes: username, dislikes: username }
            };
            message = "Post like/dislike removed!";
        }

        const result = await Post.updateOne({postId: postId}, update);

        if (result.nModified === 0) {
            return res.status(404).json({ status: "error", message: "Post does not exist!" });
        }
        
        return res.status(200).json({ status: "success", message: message });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Internal Server Error!" });
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
