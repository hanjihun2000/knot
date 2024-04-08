import React, { useState, useEffect } from 'react';
import '../component_css/UserProfile.css';
import profilePicture from './profile-picture.jpg';
import editIcon from './edit-icon.png';
import trashIcon from './trash-icon.png';

import { useParams } from 'react-router-dom';
import { useUser } from '../../userContext';
const UserProfile = () => {
  const { username } = useParams();
  const {user} = useUser();
  const [userPosts, setUserPosts] = useState([]);
  const [userBio, setUserBio] = useState('');
  const [showPosts, setShowPosts] = useState(true);
  const [userComments, setUserComments] = useState([]);

  useEffect(() => {
    const fetchUrl = `http://localhost:8000/api/userapi/fetchUserPosts?username=${username}`;
    fetch(fetchUrl)
      .then(response => response.json())
      .then(data => {
        if (data.posts) {
          setUserPosts(data.posts);
          if (data.posts.length > 0) {
            setUserBio(data.posts[0].text);
          }
        }
      })
      .catch(error => console.error('Error fetching user posts:', error));
  }, [username]);



  const fetchComments = () => {
    const commentsUrl = `http://localhost:8000/api/commentapi/fetchComments?username=${username}`;
    fetch(commentsUrl)
      .then(response => response.json())
      .then(data => {
        if (data.comments) {
          setUserComments(data.comments);
        }
        console.log(data.comments);
      })
      .catch(error => console.error('Error fetching user comments:', error));
  };

  // Function to handle the toggle between posts and comments
  const toggleView = (view) => {
    setShowPosts(view === 'posts');
    if (view === 'comments' && userComments.length === 0) {
      fetchComments(); // Fetch comments only if we haven't already
    }
  };

  const handleToggleView = (view) => {
    if (view === 'comments' && userComments.length === 0) {
      fetchComments();
    }
    setShowPosts(view === 'posts');
  };

  const renderMedia = (media) => {
    console.log(media);
    if (!media || !media.buffer|| !media.mimetype) {
      return null; // or some placeholder for missing media
    }
  
    const blob = new Blob([new Uint8Array(media.buffer.data)], { type: media.mimetype });
  
    // Create an object URL for the blob
    const blobUrl = URL.createObjectURL(blob);
    if (media.mimetype.startsWith('image/')) {
      return <img  className = "picture" src={blobUrl} alt="Post" />;
    } else if (media.mimetype.startsWith('video/')) {
      return (
        <video controls className = "picture" >
          <source src={blobUrl} type={media.mimetype} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return null; // or some placeholder for unsupported media types
    }
  };
  

  return (
    <div className="user-profile-container">
      <div className="user-info">
        <img src={user.profilePicture || profilePicture} alt="Profile" className="profile-picture" />
        <div className="user-details">
          <h2>{username}</h2>
          <p>{userBio}</p>
        </div>
      </div>
      <div className="view-toggle">
        <button onClick={() => handleToggleView('posts')} className={showPosts ? 'active' : ''}>
          Posts
        </button>
        <button onClick={() => handleToggleView('comments')} className={!showPosts ? 'active' : ''}>
          Comments
        </button>
      </div>
      {showPosts ? (
        <div className="posts-container">
          {userPosts.map((post, index) => (
            <div key={index} className="post">
              <div className="post-header">
                <h4>{post.title}</h4>
                <div className="post-actions">
                  <img src={editIcon} alt="Edit" className="action-icon" />
                  <img src={trashIcon} alt="Delete" className="action-icon" />
                </div>
              </div>
              <p>{post.author}</p>
              <div className="post-media">
                {renderMedia(post.media)}
              </div>
              <p><span className="username">{username}</span>'s comment: {post.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="comments-container">
          <h3>Comments</h3>
          {userComments.map((comment, index) => (
            <div key={index} className="comment">
              <p>{comment.text}</p>
              {/* Render additional comment details here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default UserProfile;
