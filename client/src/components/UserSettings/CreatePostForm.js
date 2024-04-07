import React, { useState, useRef } from 'react';
import '../component_css/CreatePostForm.css';
import defaultImage from './iphone14promax_dirt_0.5x.jpg';

const CreatePostForm = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postImage, setPostImage] = useState(defaultImage);
  const fileInputRef = useRef(null);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
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
        <img src={postImage} alt="Post" className="post-image" />
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*"
        />
      </div>
      <div><button onClick={handleAttachPhotoClick} className="attach-photo-button">Attach Photo</button>   </div>
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