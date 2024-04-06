import React, { useState, useEffect, useRef } from 'react';
import upvoteImg from './U.png';
import downvoteImg from './R.png';
import '../component_css/MainPagePostInt.css';
import postImage from './iphone14promax_dirt_0.5x.jpg'

const MainPagePostInt = () => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Adjust the height of the textarea based on its scroll height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newComment]);

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
    <div className="instagram-post">
      <div className="post-header">
        <div className="user-info">
          <img src="user-profile-pic.jpg" alt="User Profile" className="profile-pic" />
          <span className="username">Username</span>
        </div>
        <button className="report-button">Report</button>
      </div>
      <div className="post-image">
        <img src={postImage} alt="Post Image" />
      </div>
      <div className="post-actions">
        <div className="action-buttons">
          <button className="vote-button" onClick={handleLike}>
            <img src={upvoteImg} alt="Upvote" /> Like ({likes})
          </button>
          <button className="vote-button" onClick={handleDislike}>
            <img src={downvoteImg} alt="Downvote" /> Dislike ({dislikes})
          </button>
        </div>
      </div>
      <div className="post-content">
        <p className="post-description">Post Description</p>
      </div>
      <div className="comments-container">
        <textarea
          ref={textareaRef}
          value={newComment}
          onChange={handleCommentChange}
          onKeyPress={handleKeyPress}
          placeholder="Add a comment..."
          rows="1"
          className="comment-input"
        ></textarea>
        <div className="comments">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <span className="username">Username</span> {comment}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPagePostInt;