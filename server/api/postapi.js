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
const follow = require("../models/follow");

async function generateUniquePostId() {
    let id;
    // generate a postId that is unique
    do {
        id = Math.floor(Math.random() * 1000000000);
    } while (await Post.exists({ postId: id }));

    return id;
}

router.post("/createPost", upload.single('media'), async (req, res) => {
    // const username = req.body.username;
    // const title = req.body.title;
    // const text = req.body.text;
    // const buffer = req.file.buffer;
    // const mimetype = req.file.mimetype;

    const {username, title, text, buffer, mimetype} = req.body;

    const postId = await generateUniquePostId();

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

router.put("/editPost", upload.none(), async (req, res) => {
    const {postId, title, media, text} = req.body;

    try 
    {

        //push updates directly to the database
        const updatedField = {};
        if (title) updatedField.title = title;
        if (media) updatedField.media = media;
        if (text) updatedField.text = text;

        const updatedPost = await Post.findOneAndUpdate({ postId: postId }, updatedField);

        if (!updatedPost) {
            return res.status(404).json({ status: "error", message: "Post does not exist!" });
        }

        res.status(200).json({ status: "success", message: "Post updated successfully!" });
    } 
    catch (error)
    {
        res.status(500).json({ status: "error", message: "Internal server error!" });
    }
});

router.delete("/deletePost", upload.none(), async (req, res) => {
    const {postId} = req.body;
    
    try 
    {
        const deletedPost = await Post.findOneAndDelete({ postId: postId });
    
        if (!deletedPost) 
        {
            return res.status(404).json({ status: "error", message: "Post does not exist!" });
        }
    
        res.status(200).json({ status: "success", message: "Post deleted successfully!" });
    }
    catch (error)
    {
        console.log(error);
        res.status(500).json({ status: "error", message: "Post deletion failed!" });
    }
});


// Post is immediately added to the database with the original post's information
router.post("/sharePost", upload.none(), async (req, res) => {
    const { postId, username } = req.body;

    console.log(req.body)
    
    try 
    {
        const originalPost = await Post.findOne({ postId: postId });

        if (!originalPost) 
        {
            return res.status(404).json({ status: "error", message: "Post does not exist!" });
        }

        // if the original post is reported, do not allow the user to share it
        if (originalPost.IsReported) 
        {
            return res.status(403).json({ status: "error", message: "Post is reported!" });
        }

        // generate a postId that is unique
        const newPostId = await generateUniquePostId();

        //get media of original post

        const sharedMedia = originalPost.media ? { buffer: originalPost.media.buffer, mimetype: originalPost.media.mimetype } : null;

        const sharedPost = new Post({
            postId: newPostId,
            username: username,
            originalPostId: originalPost.originalPostId ? originalPost.originalPostId : originalPost.postId,
            originalUsername: originalPost.originalUsername ? originalPost.originalUsername : originalPost.username,
            title: originalPost.title,
            text: originalPost.text,
            media: sharedMedia,
            likes: [],
            dislikes: [],
            IsReported: false
        });

        //return new post in response
        sharedPost.save().then(savedPost => {
            res.status(201).json({ status: "success", message: "Post shared successfully!", postId: savedPost.postId });
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "Internal server error!" });
    }
});

router.get("/fetchAllPostIds", upload.none(), async (req, res) => {
    const postQuery = await Post.find().select('postId');
    const posts = postQuery.map(post => post.postId);
    res.status(200).json({ status: "success", message: "All post IDs fetched!", postIds: posts });
});

router.get("/fetchAllPosts", upload.none(), async (req, res) => {
    const posts = await Post.find();
    res.status(200).json({ status: "success", message: "All posts fetched!", postIds: posts });
});

router.get("/fetchPost", upload.none(), async (req, res) => {
    console.log(req.query)
    const postId = req.query.postId;
    const post = await Post.findOne({ postId: postId });

    if (!post) {
        return res.status(404).json({ status: "error", message: "Post does not exist!" });
    }



    // send the post information back to the client
    // const postInfo = {
    //     postId: post.postId,
    //     originalPostId: post.originalPostId,
    //     originalUsername: post.originalUsername,
    //     username: post.username,
    //     title: post.title,
    //     text: post.text,
    //     media: post.media,
    //     likes: post.likes,
    //     dislikes: post.dislikes,
    //     IsReported: post.IsReported
    // };
    res.status(200).json(post);
});

router.get("/recommendPosts", upload.none(), async (req, res) => {
    try {
        const username = req.query.username;
        const user = await User.findOne({ username: username }).select("following");

        const {following} = user;

        if (!user) {
            return res.status(404).json({ status: "error", message: "Username does not exist!" });
        }

        followingPosts = await Post.find({ username: { $in: following } });
        //random pick 3 posts from followingPosts

        //shuffle
        recommendedPosts = followingPosts.sort(() => Math.random() - 0.5).slice(0, 3);
        remainingPosts = await Post.find({ username: { $nin: recommendedPosts} });

        recommendedPosts.push(...(remainingPosts.sort(() => Math.random() - 0.5).slice(0, 6 - recommendedPosts.length)));

        res.status(200).json({ status: "success", message: "Recommended posts fetched!", posts: recommendedPosts });
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "error", message: "An error occurred while fetching recommended posts!" });
    }
});

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

router.put("/reportPost", upload.none(), async (req, res) => {
    const {postId} = req.body;
    const post = await Post.findOne({ postId: postId });

    try {
        if (!post) {
            return res.status(404).json({ status: "error", message: "Post does not exist!" });
        }

        // if the post exists, set the IsReported attribute to true
        post.IsReported = true;
        post.save().then(() => {
            res.status(200).json({ status: "success", message: "Post reported successfully!" });
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "An error occurred while reporting the post!" });
    }
});

router.get("/searchPosts", upload.none(), async (req, res) => {
    // return a list of postIds that contain the keyword in the title
    try {
        const keyword = req.query.keyword;
        const postsSearchedByTitle = await Post.find({ title: { "$regex": keyword, "$options": "i" } });
        const postsSearchedByText = await Post.find({ text: { "$regex": keyword, "$options": "i" } });

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
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "Internal Server Error!" });
    }
});

module.exports = router;
