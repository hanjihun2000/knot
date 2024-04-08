import React, { useState } from 'react';
import Sidebar from '../SidebarComp/Sidebar';
import ProfileSettings from '../ProfileSettings';
import Navbar from '../Navbar';
import ProfileEdit from './ProfileEdit';
import ProfileSideBarEdit from '../SidebarComp/ProfileSideBar';
import MainPagePrivacyDets from './MainPagePrivacyDets';
import upvote from './U.png';
import ProfileSideBarPrivacy from '../SidebarComp/ProfileSideBarPrivacy';
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
        <ProfileSideBarEdit/>
          <ProfileEdit/>
         
        </div>
      </div>
    
    </div>
  );
};

export default MainPageEdit;