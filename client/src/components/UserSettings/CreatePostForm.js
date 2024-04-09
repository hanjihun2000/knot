import React, { useState, useRef } from 'react';
import '../component_css/CreatePostForm.css';
import defaultImage from './iphone14promax_dirt_0.5x.jpg';
import { useUser } from '../../userContext';
const CreatePostForm = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postImage, setPostImage] = useState(defaultImage);
  const { user, logout } = useUser(); 
  const fileInputRef = useRef(null);
  const [postFileType, setPostFileType] = useState('');

  const handlePostTitleChange = (e) => {
    setPostTitle(e.target.value);
  };

  const handlePostDescriptionChange = (e) => {
    setPostDescription(e.target.value);
  };

  const handleAttachPhotoClick = () => {
    // Trigger the file input when the attach photo button is clicked
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPostFileType(file.type.startsWith("video") ? "video" : "image");
      const reader = new FileReader();
      reader.onloadend = () => setPostImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(fileInputRef.current.files[0]);
    const formData = new FormData();
    formData.append('username', user.username); // You might want to dynamically set this
    formData.append('title', postTitle);
    formData.append('text', postDescription);
  
    // Only append the file if a file was selected
    if (fileInputRef.current.files[0]) {
      
      formData.append('media', fileInputRef.current.files[0]);
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/postapi/createPost', {
        method: 'POST',
        body: formData, // formData will be the body of the request
        
      });
  
      const responseData = await response.json();
      if (response.ok) {
        alert('Post created successfully!');
        console.log(responseData);
        // Reset form state here if desired
      } else {
        // Handle server errors or validation errors
        alert(`Failed to create post: ${responseData.message}`);
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('An error occurred while trying to create the post.');
    }
  };
  
  return (
    <div className="create-post-container">
      <div className="create-post-header">Create Post</div>
      <hr className="separator" />
      <input
        type="text"
        placeholder="Enter post title"
        value={postTitle}
        onChange={handlePostTitleChange}
        className="post-title-input"
      />
      <div className="post-image-container">
      <div className="post-preview-container">
      {
          postFileType === "image" && <img src={postImage} alt="Post" className="post-image" />
        }
        {
          postFileType === "video" && <video controls src={postImage} className="post-video"></video>
        }
      </div>
        
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*,video/*,.mkv"
          name="media" 
        />
      </div>
      <div className="photo-container">
        <button onClick={handleAttachPhotoClick} className="attach-photo-button">Attach Photo</button>   </div>
        <textarea
          placeholder="What's on your mind?"
          value={postDescription}
          onChange={handlePostDescriptionChange}
          className="post-description-input"
        />
        <button onClick={handleSubmit} className="create-post-button">
        Create Post
      </button>
    </div>
  );
};

export default CreatePostForm;