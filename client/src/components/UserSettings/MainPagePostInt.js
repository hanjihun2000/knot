import React, { useState, useEffect, useRef } from 'react';
import upvoteImg from './U.png';
import downvoteImg from './R.png';
import '../component_css/MainPagePostInt.css';

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
    <div>
      <div>
        <img src="user-profile-pic.jpg" alt="User Profile" />
        <span> Username</span>
        <button>Report</button>
      </div>
      <h3>Post Title</h3>
      <p>Post Description</p>
      <div className="image-pair">
        <button className="vote-button" onClick={handleLike}>
          <img src={upvoteImg} alt="Upvote" /> Like ({likes})
        </button>
        <button className="vote-button" onClick={handleDislike}>
          <img src={downvoteImg} alt="Downvote" /> Dislike ({dislikes})
        </button>
      </div>
      <textarea
  ref={textareaRef}
  value={newComment}
  onChange={handleCommentChange}
  onKeyPress={handleKeyPress}
  placeholder="Add a comment and press Enter..."
  rows="1" // Start with a single row
  style={{ resize: 'none' }} // Prevent manual resizing
></textarea>
      <div className="comments">
        {comments.map((comment, index) => (
          <div key={index} className="comment">{comment}</div>
        ))}
      </div>
    </div>
  );
};

export default MainPagePostInt;
