import React, { useState, useEffect } from 'react';
import '../component_css/UserProfile.css';

import editIcon from './edit-icon.png';
import trashIcon from './trash-icon.png';
import enlargeIcon from './enlarge-icon.png';
import { useParams } from 'react-router-dom';
import { useUser } from '../../userContext';
import { Link } from 'react-router-dom';

// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';

// import {useAuthState} from 'react-firebase-hooks/auth';
// import {useCollectionData} from 'react-firebase-hooks/firestore';
 

const UserProfile = () => {
  const { username } = useParams();
  const {user} = useUser();
  const [userPosts, setUserPosts] = useState([]);
  const [userBio, setUserBio] = useState('');
  const [showPosts, setShowPosts] = useState(true);
  const [userComments, setUserComments] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [friendList, setFriendList] = useState([]);
  const handleEditClick = (post) => {
    setEditingPost(post);
    setEditingText(post.text);
  };


  const fetchFriendList = () => {
    
    fetch(`http://localhost:8000/api/userapi/viewFollowing?username=${user.username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const usernames = data.map(user => user.username);
        console.log(usernames);
        console.log(data);
        setFriendList(usernames);
        
      })
      .catch(error => console.error('Fetching error:', error));
  };

  // Fetch data only once when the component mounts
  useEffect(() => {
    fetchFriendList();
  }, [user]);

  const sendFollowRequest = async (sender, receiver) => {
    try {
      const response = await fetch('http://localhost:8000/api/followapi/makeFollowRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender, receiver }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.log(data);
        throw new Error(data.message || 'Failed to send follow request.');
      }
  
      alert(data.message); // Or handle the success response in another way
    } catch (err) {
      console.error('Error sending follow request:', err.message);
      alert(err.message); // Or handle the error in another way
    }
  };
  
  const handleTextChange = (event) => {
    setEditingText(event.target.value);
  };

  const handleDiscard = () => {
    setEditingPost(null);
    // No need to reset editingText here as it's only used when editingPost is not null
  };
  

  const handleDeletePost = async (post) => {
    // Display a confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this post?");
    const postId = post.postId;
    // Proceed only if the user confirms
    if (!isConfirmed) {
      return; // Early return if the user cancels the action
    }
  
    const apiUrl = 'http://localhost:8000/api/postapi/deletePost'; // The endpoint you provided
  
    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }), // Send the postId to delete
      });
  
      const data = await response.json(); // Assuming the server responds with JSON
      if (response.ok) {
        // Update the state to remove the deleted post from the UI
        setUserPosts(currentPosts => currentPosts.filter(post => post.postId !== postId));
        // Optionally, show a success message
        alert('Post deleted successfully!');
      } else {
        // Handle server errors (e.g., post not found)
        console.error(data.message);
        // Optionally, provide user feedback based on the error
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      // Handle network errors
      console.error("Network error:", error);
      // Optionally, provide user feedback
      alert('Network error, could not delete post.');
    }
  };
  

  const handleConfirm = async () => {
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
    const apiUrl = 'http://localhost:8000/api/postapi/editPost';
  

    const postData = {
      postId: editingPost.postId,
      text: editingText,
      
    };


    try {
      const response = await fetch(apiUrl, {
        method: 'PUT', // since it's an update operation
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      const data = await response.json(); // Assuming the server responds with JSON
      if (response.ok) {
        // Update the local state only if the server confirms the update
        setUserPosts((currentPosts) =>
          currentPosts.map((post) => {
            if (post.postId === editingPost.postId) {
              return { ...post, text: editingText }; // Update any other fields if necessary
            }
            return post;
          })
        );
        setEditingPost(null);
      setEditingText("");
        // Handle any additional UI feedback, such as showing a success message
      } else {
        // Handle server errors (e.g., post not found or validation errors)
        console.error(data.message);
        // Optionally, provide user feedback based on the error
      }
    } catch (error) {
      // Handle network errors
      console.error("Network error:", error);
      // Optionally, provide user feedback based on the error
    }
  };
    
  
  
  useEffect(() => {
    fetch(`http://localhost:8000/api/userapi/viewProfilePicture?username=${username}`)
      .then(response => {
        if (!response.ok) {
          
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(data => {
        const image = URL.createObjectURL(data);
        
        setUserProfilePic(data.size? image : null);
      })
      .catch(error => console.error('Fetching error:', error));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8000/api/userapi/fetchUser?username=${username}`)
      .then(response => {
        if (!response.ok) {
          console.log(response)
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        
        setUserBio(data.bio);
        
        
      })
      .catch(error => console.error('Fetching error:', error));
  }, [username]);


  useEffect(() => {
    const fetchUrl = `http://localhost:8000/api/userapi/fetchUserPosts?username=${username}&sender=${username}`;
    
    fetch(fetchUrl)
      .then(response => response.json())
      .then(data => {
        
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
        <img src={userProfilePic} alt="Profile" className="profile-picture" />
        {user.username !== username && (
          friendList.includes(username) ? 
          <span className="follow-button">Followed</span> : 
          <button className="follow-button" onClick={() => sendFollowRequest(user.username, username)}>Follow</button>
        )}
        <div className="user-details">
          <h2>{username}</h2>
          <p>{userBio}</p>
        </div>
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
                  <div className="post-media">{renderMedia(post.media)}</div>
                  <textarea
                    className="text-description"
                    value={editingText}
                    onChange={handleTextChange}
                  />
                </div>
              ) : (
                <div>
                  <div className="post-media">{renderMedia(post.media)}</div>
                  <textarea readOnly className="text-description" value={post.text}></textarea>
                </div>
              )}
              <div className="post-actions">
                {user.username === username && (
                  <>
                    {editingPost && editingPost.postId === post.postId ? (
                      <>
                        <button onClick={handleConfirm}>Confirm</button>
                        <button onClick={handleDiscard}>Discard</button>
                      </>
                    ) : (
                      <>
                        <img src={editIcon} alt="Edit" className="action-icon" onClick={() => handleEditClick(post)} />
                        <img src={trashIcon} alt="Delete" className="action-icon" onClick={() => handleDeletePost(post)} />
                      </>
                    )}
                  </>
                )}
                <Link to={`/posts/${post.postId}`} state={{ post }} className="post-link">
                  <img src={enlargeIcon} alt="Enlarge" className="action-icon" />
                </Link>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
  ;}


export default UserProfile;
