import React, { useState, useEffect } from 'react';
import '../component_css/UserProfile.css';
import profilePicture from './profile-picture.jpg';
import editIcon from './edit-icon.png';
import trashIcon from './trash-icon.png';

import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { username } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [userBio, setUserBio] = useState('');
  const [showPosts, setShowPosts] = useState(true);

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
        <img  src={profilePicture} alt="Profile" className="profile-picture" />
        <div className="user-details">
          <h2>{username}</h2>
          <p>{userBio}</p>
        </div>
      </div>
      <div className="view-toggle">
        <button onClick={() => setShowPosts(true)} className={showPosts ? 'active' : ''}>
          Posts
        </button>
        <button onClick={() => setShowPosts(false)} className={!showPosts ? 'active' : ''}>
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
              <p>
                <span className="username">{username}</span>'s comment: {post.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="comments">
          <h3>Comments</h3>
          {/* Render comments or placeholder if comments functionality is not implemented */}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
