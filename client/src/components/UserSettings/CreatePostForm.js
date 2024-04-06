import React, { useState } from 'react';
import '../component_css/CreatePostForm.css';
import postImage from './iphone14promax_dirt_0.5x.jpg';

const CreatePostForm = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');

  const handlePostTitleChange = (e) => {
    setPostTitle(e.target.value);
  };

  const handlePostDescriptionChange = (e) => {
    setPostDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Post Title:', postTitle);
    console.log('Post Description:', postDescription);
  };

  return (
    <div className="create-post-container">
      <div className="create-post-header">Create Post</div>
      <input
        type="text"
        placeholder="Enter post title"
        value={postTitle}
        onChange={handlePostTitleChange}
        className="post-title-input"
      />
      <div className="post-image-container">
        <img src={postImage} alt="Beach" className="post-image" />
      </div>
      <textarea
        placeholder="What's on your mind"
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