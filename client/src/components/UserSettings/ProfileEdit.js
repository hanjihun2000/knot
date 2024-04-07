import '../component_css/ProfileEdit.css';
import React, { useState } from 'react';
import toggleVisi from './OIP.jpg';
import { useUser } from '../../userContext';

const ProfileEdit = () => {
  const [username, setUsername] = useState('');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  
  const { user, logout,setUser } = useUser(); 
  const [bio, setBio] = useState(user.bio || '');
  // For profilePic, since it's initially a URL, introduce a new state to track changes
  const [profilePicFile, setProfilePicFile] = useState(null); // Track file changes
  const [profilePic, setProfilePic] = useState(user.profilePic || null);
  
  console.log(bio);
  console.log(profilePic);
  const handleEditSignUp = async (event) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const apiUrl = 'http://localhost:8000/api/userapi/editUserProfile';

    // Use FormData to handle file uploads
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('password', password);
    if (bio !== user.bio) formData.append('bio', bio); // Only append if changed
    if (profilePicFile) formData.append('profilePicture', profilePicFile); // Append new file if selected

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT', // Make sure to use 'PUT' if that's what your backend is expecting
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        alert(data.message || 'Profile Edit Successful!');
        console.log(profilePic);
        setUser((currentUser) => ({
          ...currentUser,
          bio: bio,
          profilePicture: URL.createObjectURL(profilePic)
        }));
      } else {
        alert(data.message || 'An error occurred during edit');
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file && file.size <= 5242880) { // 5 MB in bytes
      setProfilePic(file);
      setProfilePicFile(file);
    } else {
      alert('File size should be less than 5MB');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  return (
    <div className="profile-edit">
      <h2>Edit Profile</h2>

      <div>{user.username}</div>
      <form className="edit-form" onSubmit={handleEditSignUp}>
        <div className="profile-container">
          
        <img src={profilePic == null ? user.profilePicture: URL.createObjectURL(profilePic)} alt="Profile" />

          <label htmlFor="profile-pic-input" className="file-input-button">Choose a Photo</label>
          <input 
            id="profile-pic-input"
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
          />
        </div>
        
        <textarea
          placeholder={user.bio}
          value={bio }
          onChange={(e) => setBio(e.target.value)}
          className='bio-input'
        />
        <div className="password-container">
          <input
            type={passwordShown ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="password-input"
            required
          />
          <img className='toggle-vis' src={toggleVisi} alt="Show/Hide" onClick={togglePasswordVisibility} />
        </div>
        <div className="password-container">
          <input
            type={confirmPasswordShown ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="password-input"
            required
          />
          <img className='toggle-vis' src={toggleVisi} alt="Show/Hide" onClick={toggleConfirmPasswordVisibility} />
        </div>
        <button type="submit" className="confirm-button">Confirm</button>
      </form>
    </div>
  );
};

export default ProfileEdit;
