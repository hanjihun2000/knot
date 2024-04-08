import React, { useState, useEffect, useRef } from 'react';
import upvoteImg from './U.png';
import downvoteImg from './R.png';
import '../component_css/MainPagePostInt.css';
import postImage from './iphone14promax_dirt_0.5x.jpg'
import { useUser } from '../../userContext';

const MainPagePostInt = () => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const textareaRef = useRef(null);
  const { username } = useUser(); // setUsername removed since it wasn't used
  const { posts } = useState([]);
  
  const [isImageActive, setIsImageActive] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleImageClick = () => {
    setIsImageActive(current => !current);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  useEffect(() => {
    const closeComments = (event) => {
      if (!event.target.closest('.comments-container') && showComments) {
        setShowComments(false);
      }
    };

    document.addEventListener('click', closeComments);
    return () => {
      document.removeEventListener('click', closeComments);
    };
  }, [showComments]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newComment]);

  //fetch posts
  useEffect(() => {
    fetch(`http://localhost:8000/api/postapi/recommendPosts?username=${username}`) // Fetch posts for the user
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          posts = data.posts;
        } else {
          alert(data.message);
        }
      }).catch((error) => {
        console.error('There was an error!', error);
      });
  }, [username]);

  console.log(posts);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleDislike = () => {
    setDislikes(dislikes + 1);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && newComment.trim() !== '') {
      e.preventDefault();
      setComments([...comments, newComment.trim()]);
      setNewComment('');
    }
  };
  
  return (
    <div className="post-container">
      <div className="post-header">
        <div className="user-info">
          <img src="user-profile-pic.jpg" alt="User Profile" className="profile-pic" />
          <span className="username">{username}</span>
        </div>
        <button className="options-button">⋯</button>
      </div>
      <div className="post-content">
        <div className="post-title">My first beach trip!</div>
        <div className="post-image" onClick={handleImageClick}>
        {!isImageActive &&    <img src={postImage} alt="Post Image" /> }
        </div>
        <div className="post-description-actions">
          <div className="post-description">
            <p>Happy day! <span>#beach</span> <span>#ik</span> <span>#sand</span> <span>#holiday</span></p>
          </div>
          <div className="action-buttons">
            <button className="vote-button" onClick={handleLike}>
              <img src={upvoteImg} alt="Upvote" /> Like ({likes})
            </button>
            <button className="vote-button" onClick={handleDislike}>
              <img src={downvoteImg} alt="Downvote" /> Dislike ({dislikes})
            </button>
          </div>
        </div>
        <div className="comments-container" onClick={toggleComments}>
          <div className="comment-info">View comments</div>
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={handleCommentChange}
            onKeyPress={handleKeyPress}
            placeholder="Write a comment..."
            rows="1"
            className="comment-input"
          ></textarea>
          {showComments && (
            <div className="comments">
              {comments.map((comment, index) => (
                <div key={index} className="comment">
                  <span className="username">{username}</span> {comment}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {isImageActive && (
        <div className="image-overlay" onClick={() => setIsImageActive(false)}>
          <img src={postImage} alt="Post Image Enlarged" />
        </div>
      )}
    </div>
  );
};

export default MainPagePostInt;
