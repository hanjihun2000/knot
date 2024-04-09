import React, { useState, useEffect, useRef } from 'react';
import upvoteImg from '../UserSettings/U.png';
import downvoteImg from '../UserSettings/R.png';

import postImage from '../UserSettings/iphone14promax_dirt_0.5x.jpg'
import { useUser } from '../../userContext';
import './singPagePost.css';
const SingPagePost = () => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const textareaRef = useRef(null);
  const { username } = useUser(); // setUsername removed since it wasn't used
  
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
    <div className="post-container-sign">
      <div className="post-content-wrapper-sign">
        <div className="post-image-container-sign">
          <img src={postImage} alt="Beach" className="post-image-sign" />
        </div>
        <div className="post-text-content-sign">
          <p className="post-description-sign">
            Happy day! <span className="hashtag">#beach</span> <span className="hashtag">#hk</span> <span className="hashtag">#sand</span> <span className="hashtag">#holiday</span>
          </p>
          <div className="comments-section-sign">
            {/* Map through your comments here */}
            <div className="comment-sign">
              <span className="comment-user-sign">hanjihun:</span>
              <span className="comment-text-sign">Nice!</span>
              {/* ... */}
            </div>
            {/* ... other comments ... */}
          </div>
        </div>
      </div>
    </div>
  );

};


export default SingPagePost;
