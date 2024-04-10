import React, { useState, useEffect, useRef } from 'react';
import upvoteImg from '../U.png';
import downvoteImg from '../R.png';
import shareImg from '../share.svg';
import reportImg from '../report.jpeg';
import {Warning} from "@phosphor-icons/react";
import { useParams } from 'react-router-dom';
import placeholderImage from '../../components/plaimg.png';
import './singPagePost.css';

import { useUser } from '../../userContext';
import { NavLink } from 'react-router-dom';

const SingPagePost = () => {
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const textareaRef = useRef(null);
  const { username } = useUser(); // setUsername removed since it wasn't used
  const [imageSrc, setImageSrc] = useState(placeholderImage);
  const [isImageActive, setIsImageActive] = useState(false);
  const { postId } = useParams();
  const [postData, setPostData] = useState([]);
  const [profilePic, setProfilePic] = useState(placeholderImage);
  const {user} = useUser();
  const handleImageClick = () => {
    setIsImageActive(current => !current);
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
      setLikeCount(data.likes.length);
      setDislikeCount(data.dislikes.length);
      setLike(data.likes.includes(user.username));
      setDislike(data.dislikes.includes(user.username));
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
      } else {
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

  const handleLike = () => {
    fetch(`http://localhost:8000/api/postapi/likeDislikePost`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
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

  const handleDislike = () => {
    fetch(`http://localhost:8000/api/postapi/likeDislikePost`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
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


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newComment]);


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

  const loadProfilePic = async () => {
    fetch(`http://localhost:8000/api/userapi/viewProfilePicture?username=${postData.username}`)
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((data) => {
        console.log(data);
        if (data.size) {
          const blobUrl = URL.createObjectURL(data);
          setProfilePic(blobUrl);
        } else {
          setProfilePic(placeholderImage);
        }
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  useEffect(() => {
    loadProfilePic();
  } , [postData.username]);

  const sharePost = () => {
    fetch(`http://localhost:8000/api/postapi/sharePost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: postId,
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
        postId: postId,
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      alert('Post reported!');
      return response.json();
    }).catch(error => console.error('Fetching error:', error));
  }

  const reportComment= (commentId) => {
    
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
  
  
  
  return (
    <div className="post-container-sign">
      <div className="post-content-wrapper-sign">
        <div className="post-image-container-sign">
          <img src={imageSrc} alt="Image" className="post-image-sign" />
        </div>
        <div className="post-text-content-sign">
          <NavLink to={`/profile/${postData.username}`} className="post-username-sign no-underline">
            <div className="post-user-info">
              <img src={profilePic} alt="Profile" className="post-profile-image-sign" />
              <span className="username">{postData.username}</span>
            </div>
          </NavLink>
          <p className="post-description-sign">
            {postData.text}
          </p>
          <div className="comments-section-sign">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="comment-sign">
                  <span className="comment-user-sign">{comment.username}: </span>
                  <span className="comment-text-sign">{comment.text}</span>
                  <button onClick={() => reportComment(comment.commentId)} className="report-comment-sign"> <Warning size={24} color="red" /></button>
                </div>
              ))
            ) : (
              <div className="no-comments-sign">No comments yet.</div>
            )}
          </div>
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={handleCommentChange}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
            placeholder="Write a comment..."
            className="new-comment-input-sign"
          ></textarea>
          <div className='button-container-sign'>
            <button onClick={handleAddComment} className="submit-comment-sign">Comment</button>
          </div>
          <div className="post-interact-button-row">  
            <button className="post-interact-button" onClick={sharePost}>
              <img src={shareImg} alt="Share"/>
            </button>
            <button className="post-interact-button" onClick={sendReport}>
              <img src={reportImg} alt="Report"/>
            </button>
            <button className="post-interact-button" onClick={handleLike}>
              <img src={upvoteImg} alt="Upvote" /> ({likeCount})
            </button>
            <button className="post-interact-button" onClick={handleDislike}>
              <img src={downvoteImg} alt="Downvote" /> ({dislikeCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );

};


export default SingPagePost;
