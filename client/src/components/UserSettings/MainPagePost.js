import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import ProfileSettings from '../ProfileSettings';
import Navbar from '../Navbar';
import ProfileEdit from './ProfileEdit';
import ProfileSideBarEdit from '../ProfileSideBarEdit';
import MainPagePostInt from './MainPagePostInt';
import upvote from './U.png';
import downvote from './R.png'
import '../component_css/MainPage.css';







const MainPageEdit = () => {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="profile-edit-container">
        
          <MainPagePostInt/>
         
        </div>
      </div>
    
    </div>
  );
};

export default MainPageEdit;