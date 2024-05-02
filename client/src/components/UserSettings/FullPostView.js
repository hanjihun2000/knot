import React from "react";
import "../component_css/MainPagePostInt.css";
import editIcon from "./edit-icon.png";
import trashIcon from "./trash-icon.png";

const FullPostView = ({ post }) => {
  return (
    <div className="post-container">
      <div className="post-header">
        <div className="user-info">
          <img
            src={post.userProfilePic}
            alt="Profile"
            className="profile-pic"
          />
          <span className="username">{post.username}</span>
        </div>
        <div className="post-actions">
          <img src={editIcon} alt="Edit" className="action-icon" />
          <img src={trashIcon} alt="Delete" className="action-icon" />
        </div>
      </div>
      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <div className="post-image">
          <img src={post.imageUrl} alt="Post" />
        </div>
        <div className="post-description-actions">
          <p className="post-description">
            <span>{post.username}</span> {post.description}
          </p>
          <div className="action-buttons">
            <button className="vote-button">
              <img src="like-icon.png" alt="Like" />
              <span>{post.likes}</span>
            </button>
            <button className="vote-button">
              <img src="dislike-icon.png" alt="Dislike" />
              <span>{post.dislikes}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="comments-container">
        <div className="comment-info">
          <span>{post.commentCount} comments</span>
        </div>
        <textarea className="comment-input" placeholder="Add a comment..." />
        <div className="comments">
          {post.comments.map((comment, index) => (
            <div key={index} className="comment">
              <img
                src={comment.userProfilePic}
                alt="User"
                className="comment-user-pic"
              />
              <p className="comment-text">{comment.text}</p>
              <div className="comment-actions">
                <button className="comment-action">
                  <img src="like-icon.png" alt="Like" />
                </button>
                <button className="comment-action">
                  <img src="reply-icon.png" alt="Reply" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullPostView;
