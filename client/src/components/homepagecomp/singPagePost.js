import React, { useState, useEffect, useRef } from 'react';
import upvoteImg from '../U.png';
import downvoteImg from '../R.png';
import shareImg from '../share.svg';
import reportImg from '../report.jpeg';

import { useUser } from '../../userContext';
import { useParams } from 'react-router-dom';
import placeholderImage from './plaimg.png';
import './singPagePost.css';

const SingPagePost = () => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const textareaRef = useRef(null);
  const { username } = useUser(); // setUsername removed since it wasn't used
  const [imageSrc, setImageSrc] = useState(placeholderImage);
  const [isImageActive, setIsImageActive] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { postId } = useParams();
  const [postData, setPostData] = useState([]);
  const {user} = useUser();
  const handleImageClick = () => {
    setIsImageActive(current => !current);
  };

  const toggleComments = () => {  
    setShowComments(!showComments);
  };



  const postComment = async (newCommentText) => {
    const commentData = {
      username: user.username, // Username of the commenter
      text: newCommentText, // Text content of the comment
      postId: postId, // Assuming each comment is associated with a postId
    };
  
    try {
      const response = await fetch('http://localhost:8000/api/commentapi/createComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Assuming the server responds with the newly added comment
      const addedComment = await response.json();
  
      // Optionally update comments list in the state
      setComments((prevComments) => [...prevComments, addedComment]);
  
    } catch (error) {
      console.error("Failed to post comment:", error);
      // Handle the error (e.g., show an error message)
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const commentToAdd = {
        username: user.username, // Assuming you want to use the logged-in user's name
        text: newComment.trim(),
      };
      
      setComments([...comments, commentToAdd]);
      setNewComment(''); // Reset the input field
      postComment(newComment.trim());

      // Here, you might also want to send the comment to the server
      // const response = await fetch('/api/commentapi/addComment', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(commentToAdd),
      // });
      // if (response.ok) {
      //   // Handle the successful addition of the comment
      // }
    }
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
    // Define the function to fetch data
   
    const fetchData = async () => {
      const response = await fetch(`http://localhost:8000/api/postapi/fetchPost?postId=${postId}`);
      if (!response.ok) {
        console.error('Failed to fetch post:', response.status);
        return;
      }
      const data = await response.json();
      console.log(data);
      setPostData(data);
      if (data && data.media && data.media.buffer) {
        // If data.media.buffer is present, handle it
        try {
          const byteArray = new Uint8Array(data.media.buffer.data || data.media.buffer);
          const blob = new Blob([byteArray], { type: data.media.mimetype });
          const imageObjectURL = URL.createObjectURL(blob);
      
        
          setImageSrc(imageObjectURL); // Assume you have a state or some way to handle the image source URL
        } catch (error) {
          console.error('Error creating blob from binary data', error);
          
          setImageSrc(placeholderImage);
        }
      }else {
        // media is null or undefined, handle the scenario
        console.log('Media data is not available.');
      
        // Here you could set a default image or a placeholder
        // setImageSrc(placeholderImage);
      }

      const commentsResponse = await fetch(`http://localhost:8000/api/commentapi/fetchComments?postId=${postId}`);
    if (!commentsResponse.ok) {
      console.error('Failed to fetch comments:', commentsResponse.status);
      // Handle error, perhaps set an error state to display a message
      return;
    }
    const commentsData = await commentsResponse.json();
    console.log(commentsData);
    // Set comments to state
    if(commentsData.message.length > 0) {
    setComments(commentsData.message);
    }
      
      
    };

    // Call the fetch function
    fetchData();
  }, [postId]); 

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
          <img src={imageSrc} alt="Beach" className="post-image-sign" />
        </div>
        <div className="post-text-content-sign">
          <p className="post-description-sign">
           {postData.text}
          </p>
          <div className="comments-section-sign">
            
          {comments.length > 0 ? (
    comments.map((comment, index) => (
      <div key={index} className="comment-sign">
        <span className="comment-user-sign">{comment.username}: </span>
        <span className="comment-text-sign">{comment.text}</span>
      </div>
    ))
  ) : (
    <div className="no-comments-sign">No comments yet.</div>
  )} 
            <textarea
          ref={textareaRef}
          value={newComment}
          onChange={handleCommentChange}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
          placeholder="Write a comment..."
          className="new-comment-input-sign"
        ></textarea>
        <button onClick={handleAddComment} className="submit-comment-sign">Comment</button>
          </div>
        </div>
      </div>
    </div>
  );

};


export default SingPagePost;
