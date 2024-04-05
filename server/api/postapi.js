const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.post("/create", async (req, res) => {
    console.log(req);
    console.log(req.body);
    const postId = req.body.postId;
    const username = req.body.username;
    const title = req.body.title;
    const text = req.body.text;
    const mediaType = req.body.mediaType;
    const mediaContext = req.body.mediaContext;
    const post = new Post({
        postId: postId,
        username: username,
        title: title,
        text: text,
        media: {mediaType: mediaType, mediaContext: mediaContext},
        likeDislike: [0, 0],
        comments: [],
        IsReported: false
    });
    post.save();
    res.send({ status: "success", message: "Post created successfully!" });
})

router.post("/edit", async (req, res) => {
    const postId = req.body.postId;
    const attribute = req.body.attribute;
    const value = req.body.value;
    const postExists = await Post.exists({ postId: postId });
    if (postExists) {
        // if the post exists, update the post
        const post = await Post.findOne({ postId: postId });
        post[attribute] = value;
        res.send({ status: "success", message: "Post updated successfully!" });
    }
});

router.post("/delete", async (req, res) => {
    const postId = req.body.postId;
    const postExists = await Post.exists({ postId: postId });
    if (postExists) {
        // if the post exists, delete the post
        await Post.deleteOne({ postId: postId });
        res.send({ status: "success", message: "Post deleted successfully!" });
    }
});

router.post("/share", async (req, res) => {
    const postId = req.body.postId;
    const username = req.body.username;
    const postExists = await Post.exists({ postId: postId });
    if (postExists) {
        // if the post exists, create a new post with the same content
        const post = await Post.findOne({ postId: postId });
        res.send({ 
            status: "success",
            sharedData: {
                postId: post.postId,
                username: username,
                title: post.title,
                text: post.text,
                media: {mediaType: post.media.mediaType, mediaContext: post.media.mediaContext},
                likeDislike: post.likeDislike,
                comments: post.comments,
                IsReported: post.IsReported
            }
        });
    }
});

router.get("/fetch", async (req, res) => {
    const postId = req.body.postId;
    const postExists = await Post.exists({ postId: postId });
    if (postExists) {
        // if the post exists, fetch the post
        const post = await Post.findOne({ postId: postId });
        res.send(post);
    }
});

router.post("/likedislike", async (req, res) => {
    const postId = req.body.postId;
    const likeOrDislike = req.body.likeOrDislike;
    const postExists = await Post.exists({ postId: postId });
    if (postExists && likeOrDislike == "like") {
        if (postExists) {
            // if the post exists, like the post
            const post = await Post.findOne({ postId: postId });
            post.likeDislike[0] = post.likeDislike[0] + 1;
        }
    } else if (postExists && likeOrDislike == "dislike") {
        if (postExists) {
            // if the post exists, dislike the post
            const post = await Post.findOne({ postId: postId });
            post.likeDislike[1] = post.likeDislike[1] + 1;
        }
    }
    // no need to send a response back to the client
});

router.post("/report", async (req, res) => {
    const postId = req.body.postId;
    // check if the post is inside the posts database
    const postExists = await Post.exists({ postId: postId });
    if (postExists) {
        // if the post exists, report the post
        const post = await Post.findOne({ postId: postId });
        post.IsReported = true;
    }
    // no need to send a response back to the client
});

router.get("/search", async (req, res) => {
    const query = req.body.query;
    // search for posts that contain the query keyword in the title
    const posts = await Post.find({ title: { "$regex": query, "$options": "i" } });
    // for search ranking logic, we need to check if the owner of the post is in the 
    // search user's following list, and then rank the post higher
    // *** need to implement this logic ***
    res.send(posts);
});
