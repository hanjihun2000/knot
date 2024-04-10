import React, { useState, useEffect, useRef } from 'react';

import upvoteImg from './U.png';
import downvoteImg from './R.png';
import shareImg from './share.svg';

import '../component_css/MainPagePostInt.css';
import { useUser } from '../../userContext';
import { NavLink } from 'react-router-dom';

const MainPagePostInt = ({ post }) => {
  // console.log(post)
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const textareaRef = useRef(null);
  const { user } = useUser();
  const username = user.username;
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [mediaURL, setMediaURL] = useState(null);

  const [like, setLike] = useState();
  const [dislike, setDislike] = useState();
  const [likeCount, setLikeCount] = useState();
  const [dislikeCount, setDislikeCount] = useState();

  const [isImageActive, setIsImageActive] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleImageClick = () => {
    setIsImageActive((current) => !current);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // console.log(post.postId)

  useEffect(() => {
    fetch(`http://localhost:8000/api/commentapi/fetchComments?postId=${post.postId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(data => {
        //get username and text from comments
        data = data.message.map(comment => `${comment.username}: ${comment.text}`);
        setComments(data);
      }).catch(error => console.error('Fetching error:', error));
    const closeComments = (event) => {
      if (!event.target.closest(".comments-container") && showComments) {
        setShowComments(false);
      }
    };

    document.addEventListener("click", closeComments);
    return () => {
      document.removeEventListener("click", closeComments);
    };
  }, [showComments]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newComment]);

  // set profile picture of post user
  useEffect(() => {
    fetch(
      `http://localhost:8000/api/userapi/viewProfilePicture?username=${post.username}`
    )
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((data) => {
        const image = URL.createObjectURL(data);
        setUserProfilePic(data.size ? image : null);
      })
      .catch((error) => console.error("Fetching error:", error));
  }, [post.username]);

  //set post media
  useEffect(() => {
    if (post.media) {
      // console.log(post.media.buffer)
      // console.log(post.media.mimetype)
      const byteArray = new Uint8Array(post.media.buffer.data);
      const blob = new Blob([byteArray], { type: post.media.mimetype });
      const url = URL.createObjectURL(blob);
      setMediaURL(url);
    }
  }, [post.media]);

  // init likes and dislikes
  useEffect(() => {
    setLike(post.likes.includes(user.username));
    setDislike(post.dislikes.includes(user.username));
    setLikeCount(post.likes.length);
    setDislikeCount(post.dislikes.length);
  }, []);

  // console.log("Recommended:", posts)

  const handleLike = () => {
    fetch(`http://localhost:8000/api/postapi/likeDislikePost`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: post.postId,
        username: user.username,
        like: true,
        undo: like,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLike(!like);
        setDislike(false);
        setLikeCount(data.likeCount);
        setDislikeCount(data.dislikeCount);
      })
      .catch((error) => console.error("Fetching error:", error));
  };

  const handleDislike = () => {
    fetch(`http://localhost:8000/api/postapi/likeDislikePost`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: post.postId,
        username: user.username,
        like: false,
        undo: dislike,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setDislike(!dislike);
        setLike(false);
        setLikeCount(data.likeCount);
        setDislikeCount(data.dislikeCount);
      })
      .catch((error) => console.error("Fetching error:", error));
  };

  // useEffect( () => {
  //   setLikeCount(post.likes.length + (like ? 1 : 0));
  //   setDislikeCount(post.dislikes.length + (dislike ? 1 : 0));
  // }, [like, dislike]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && newComment.trim() !== "") {
      e.preventDefault();
      setComments([...comments, `${user.username}: ${newComment}`]);
      fetch(`http://localhost:8000/api/commentapi/createComment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.postId,
          username: user.username,
          text: newComment.trim()
        })
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(data => {
        console.log(data.message);
      }).catch(error => console.error('Fetching error:', error));
      setNewComment('');
    }
  };

  const sharePost = () => {
    fetch(`http://localhost:8000/api/postapi/sharePost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: post.postId,
        username: user.username
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log(response)
      alert('Post shared successfully!');
      return response.json();
    }).catch(error => console.error('Fetching error:', error));
  }

  
  return (
    
    <div className="post-container">
      <div className="post-header">
      <NavLink to={`/profile/${post.username}`} className = 'no-underline-yep' >
        <div className="user-info no-underline-yep">
          {userProfilePic && (
            <img
              src={userProfilePic}
              alt="User Profile"
              className="profile-pic"
            />
          )}
          <span className="username">{post.username}</span>
        </div>
        </NavLink>
        <button className="options-button">⋯</button>
      </div>
      <div className="post-content">
        <NavLink to={`/posts/${post.postId}`} className = 'no-underline-yep' >
          <div className="post-title">{post.title}</div>
        </NavLink>
        <div className='original-username'>{post.originalUsername && <span>Shared from: {post.originalUsername}</span>}</div>
        <div className="post-image" onClick={handleImageClick}>
          {post.media && (
            <img src={mediaURL} alt="Post Media" className="post-image" />
          )}
        </div>
        <div className="post-description-actions">
          <div className="post-description">
            <p>{post.description}</p>
          </div>
          <div className="action-buttons">
            <button className="share-button">
              <img src={shareImg} alt="Share" onClick={sharePost}/> Share
            </button>
            <button className="vote-button" onClick={handleLike}>
              <img src={upvoteImg} alt="Upvote" /> Like ({likeCount})
            </button>
            <button className="vote-button" onClick={handleDislike}>
              <img src={downvoteImg} alt="Downvote" /> Dislike ({dislikeCount})
            </button>
          </div>
        </div>
        <div className="comments-container" onClick={toggleComments}>
          <div className="comment-info">View comments</div>
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={handleCommentChange}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            rows="1"
            className="comment-input"
          ></textarea>
          {showComments && (
            <div className="comments">
              {comments.map((comment, index) => {
                const [username, text] = comment.split(': ');
                return (
                  <div key={index} className="comment">
                    <span className="username">{username}</span>: {text}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {isImageActive && post.media && (
        <div className="image-overlay" onClick={() => setIsImageActive(false)}>
          <img src={mediaURL} alt="Post Image Enlarged" />
        </div>
      )}
    </div>
    
  );
};

export default MainPagePostInt;
