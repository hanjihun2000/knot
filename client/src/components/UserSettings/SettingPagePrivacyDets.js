import '../component_css/ProfileEdit.css';
import React, { useState } from 'react';

const SettingPagePrivacyDets = () => {
  const [isPrivate, setIsPrivate] = useState(false);

  const handlePrivacyToggle = (e) => {
    setIsPrivate(e.target.checked);
    // Here you might also want to persist the change to the user's profile in your database
  };
  

  return (
    <div className="profile-edit">
      <h2>Privacy setting</h2>
      <form className="privacy-form">
        <label>
          <span>Private account</span>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={handlePrivacyToggle}
          />
        </label>
        <p>On the other hand, if your account is private, only the followers you have approved will have access to your shared posts, follower list and following list."
    
        </p>
        <p>If your account is set to public, anyone can view your profile and posts, whether they have a Knot account or not.</p>
      </form>
    </div>
  );
};

export default SettingPagePrivacyDets;
