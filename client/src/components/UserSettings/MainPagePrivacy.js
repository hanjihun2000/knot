import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import ProfileSettings from '../ProfileSettings';
import Navbar from '../Navbar';
import MainPagePrivacyDets from './MainPagePrivacyDets';
import ProfileSideBarPrivacy from '../ProfileSideBarPrivacy';
import '../component_css/MainPage.css';







const MainPagePrivacy = () => {

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
          <ProfileSideBarPrivacy/>
          <MainPagePrivacyDets/>
         
        </div>
      </div>
    
    </div>
  );
};

export default MainPagePrivacy;