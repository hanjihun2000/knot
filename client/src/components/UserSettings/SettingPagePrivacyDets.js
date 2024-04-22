import '../component_css/ProfileEdit.css';
import React, { useState,useEffect } from 'react';
import { useUser } from '../../userContext';
const SettingPagePrivacyDets = () => {
  const [isPrivate, setIsPrivate] = useState('');
  const {user} = useUser();
  const handlePrivacyToggle = async (e) => {
    const newAccountType = isPrivate === 'private' ? 'user' : 'private';
    setIsPrivate(newAccountType); // Update local state to reflect the change

    // Persist the change to the database
    try {
      const response = await fetch('http://localhost:8000/api/userapi/editUserProfile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({
          username: user.username,
          accountType: newAccountType,
          
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update privacy setting.');
      }
      console.log('Privacy setting updated:', data.accountType, data.username);
    } catch (err) {
      console.error('Error updating privacy setting:', err.message);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:8000/api/userapi/fetchUser?username=${user.username}`, {
      method: 'GET', // Assuming a GET request; adjust if necessary
      headers: {
        'Content-Type': 'application/json',
        // Include authorization headers if required:
        // 'Authorization': 'Bearer YOUR_TOKEN_HERE',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      
      setIsPrivate(data.accountType);
    })
    .catch(error => console.error('Error fetching privacy setting:', error));
  }, []); // Empty dependency array means this effect runs once on mount



  

  return (
    <div className="profile-edit">
      <h2>Privacy setting</h2>
      <form className="privacy-form">
        <label>
          <span>Private account</span>
          <input
             type="checkbox"
             checked={isPrivate === 'private'}
             onChange={handlePrivacyToggle}
          />
        </label>
        <p>On the other hand, if your account is private, only the followers you have approved will have access to your shared posts.</p>
    
        
        <p>If your account is set to public, anyone can view your posts, whether they have a Knot account or not.</p>
      </form>
    </div>
  );
};

export default SettingPagePrivacyDets;
