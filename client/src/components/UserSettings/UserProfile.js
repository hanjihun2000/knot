import React, { useState, useEffect } from 'react';
import '../component_css/UserProfile.css';
import profilePicture from './profile-picture.jpg';
import editIcon from './edit-icon.png';
import trashIcon from './trash-icon.png';
import enlargeIcon from './enlarge-icon.png';
import { useParams } from 'react-router-dom';
import { useUser } from '../../userContext';
import { Link } from 'react-router-dom';
const UserProfile = () => {
  const { username } = useParams();
  const {user} = useUser();
  const [userPosts, setUserPosts] = useState([]);
  const [userBio, setUserBio] = useState(user.bio);
  const [showPosts, setShowPosts] = useState(true);
  const [userComments, setUserComments] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editingText, setEditingText] = useState("");
  const handleEditClick = (post) => {
    setEditingPost(post);
    setEditingText(post.text);
  };

  const handleTextChange = (event) => {
    setEditingText(event.target.value);
  };

  const handleDiscard = () => {
    setEditingPost(null);
    // No need to reset editingText here as it's only used when editingPost is not null
  };
  

  const handleConfirm = () => {
    // Here you would handle the API request to save the edited post
    // For now, we'll just update it locally
    setUserPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.postId === editingPost.postId) {
          return { ...post, text: editingText };
        }
        return post;
      })
    );
    setEditingPost(null);
    setEditingText("");
  };
  



  useEffect(() => {
    const fetchUrl = `http://localhost:8000/api/userapi/fetchUserPosts?username=${username}`;
    
    fetch(fetchUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.posts) {
          setUserPosts(data.posts);
          
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
          {userPosts.map((post) => ( 
            
            <div key={post.postId} className="post">
              <div className="post-header">
                <h4>{post.title}</h4>
              </div>
              
              {editingPost && editingPost.postId === post.postId ? (
                <div>
                <div className="post-media">
                {renderMedia(post.media)}
              </div>
                <textarea
                  className='text-description'
                  value={editingText}
                  onChange={handleTextChange}
                />
                </div>
              ) : (
                <div>
                  
                  <div className="post-media">
                    {renderMedia(post.media)}
                  </div>
                  <textarea readOnly className = 'text-description' value = {post.text}></textarea>
                </div>
              )}
              {/* Move buttons here, below the textarea or post content */}
              <div className="post-actions">
                {editingPost && editingPost.postId === post.postId ? (
                  <>
                    <button onClick={handleConfirm}>Confirm</button>
                    <button onClick={handleDiscard}>Discard</button>
                  </>
                ) : (
                  <>
                    <img src={editIcon} alt="Edit" className="action-icon" onClick={() => handleEditClick(post)} />
                    <img src={trashIcon} alt="Delete" className="action-icon" />
                    <Link to={`/posts/${post.postId}`} key={post.postId} state={{ post }} className="post-link">
                    <img src={enlargeIcon} alt="Enlarge" className="action-icon" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          
          ))}
        </div>
      ) : (
        <div className="comments-container">
          <h3>Comments</h3>
          {userComments.map((comment, index) => (
            <div key={index} className="comment">
              <p>{comment.text}</p>
              {/* Additional comment details here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );}


export default UserProfile;
