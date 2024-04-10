import React, { useState, useEffect, useRef } from 'react';

import '../component_css/MainPagePostInt.css';
import { useUser } from '../../userContext';
import { NavLink } from 'react-router-dom';
import {Share,Flag, ArrowFatUp, ArrowFatDown, Warning} from "@phosphor-icons/react";

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
  const [likeClicked, setLikeClicked] = useState(false);
  const [dislikeClicked, setDislikeClicked] = useState(false);

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
        data = data.message.map(comment => `${comment.username}: ${comment.text}: ${comment.commentId}`);
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
      .then(() => {
        if (like) {
          setLikeCount(likeCount - 1);
        } else {
          setLikeCount(likeCount + 1);
        }
        if (dislike) {
          setDislikeCount(dislikeCount - 1);
        }
        setLike(!like);
        setDislike(false);
        // setLikeCount(data.likeCount);
        // setDislikeCount(data.dislikeCount);
      })
      .catch((error) => console.error("Fetching error:", error));
  };


  const reportComment= (commentId) => {
    console.log(commentId);
    fetch(`http://localhost:8000/api/commentapi/reportComment?commentId=${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      alert('Comment reported!');
      return response.json();
    }).catch(error => console.error('Fetching error:', error));
  }

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
      .then(() => {
        if (dislike) {
          setDislikeCount(dislikeCount - 1);
        } else {
          setDislikeCount(dislikeCount + 1);
        }
        if (like) {
          setLikeCount(likeCount - 1);
        }
        setDislike(!dislike);
        setLike(false);
        // setDislikeCount(data.dislikeCount);
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
    if (e.key === 'Enter' && !e.shiftKey && newComment.trim() !== '') {
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

  const sendReport = () => {
    fetch(`http://localhost:8000/api/postapi/reportPost`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: post.postId,
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      alert('Post reported!');
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
            <div className="button-group">
              <button className="post-interact-button-button-group" onClick={sharePost}>
                <div><Share className= "Share-icon"/></div>
              </button>
              <button className="post-interact-button-button-group" onClick={sendReport}>
                <div><Flag className= "Flag-icon"/></div>
              </button>
            </div>
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
            
            <div className='like-dislike-group'>
            <button className={`post-interact-button ${like ? 'upclicked' : ''}`} onClick={handleLike}>
              <div><ArrowFatUp className= "arrowUp-icon"/> </div>
              <div className="like-dislike-count">{likeCount}</div>
            </button>
            <button className={`post-interact-button ${dislike ? 'downclicked' : ''}`} onClick={handleDislike}>
              <div><ArrowFatDown className= "arrowDown-icon"/></div>
              <div className="like-dislike-count">{dislikeCount}</div>
            </button>
            </div>
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
            <div className="comments-main-page">
              {comments.map((comment, index) => {
                console.log(comments);
                const [username, text, commentId] = comment.split(': ');
                console.log(text);
                return (
                  <div key={index} className="comment">
                    <span className="username">{username}</span>: {text}
                    <button onClick={(e) => {
  e.stopPropagation(); // Prevents the click event from propagating up to the document
  reportComment(commentId);
}} className="report-comment-sign-page">
  <Flag size={24}/>
</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
    </div>
    
  );
  
};

export default MainPagePostInt;
