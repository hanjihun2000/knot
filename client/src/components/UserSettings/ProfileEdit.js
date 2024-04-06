import '../component_css/ProfileEdit.css';
import React, { useState } from 'react';
import toggleVisi from './OIP.jpg'




const ProfileEdit = () => {


  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const handleEditSignUp = (e) => {
    // Handler for when the edit form is submitted
    e.preventDefault();
    // ... your sign-up logic here
  };
  
  
  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };


  return (
    <div className="profile-edit">
      <h2>Edit profile</h2>
      <div className="profile-picture">
        
        <img src="path_to_image" alt="Profile" />
      </div>
      <form className="edit-form" onSubmit={handleEditSignUp}>
    <input
      type="text"
      placeholder="Username"
      // ... rest of your input attributes
    />
    <div className="password-container">
      <input className = "password-input"
        type={passwordShown ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <img className = 'toggle-vis' src={toggleVisi} alt="Show/Hide" onClick={togglePasswordVisibility} />
    </div>
    <div className = "password-container">
        <input className = "password-input"
          type={confirmPasswordShown ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <img className = 'toggle-vis' src={toggleVisi} alt="Show/Hide" onClick={toggleConfirmPasswordVisibility} />
        </div>
    <input
      type="text"
      placeholder="Gender"
      // ... rest of your input attributes
    />
    <button type="submit">Confirm</button>
  </form>
    </div>
  );
};

export default ProfileEdit;