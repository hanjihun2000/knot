import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import ProfileSettings from '../ProfileSettings';
import Navbar from '../Navbar';
import ProfileEdit from './ProfileEdit';
import ProfileSideBarEdit from '../ProfileSideBarEdit';

import '../component_css/MainPage.css';







const MainPageEdit = () => {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  return (
    <div className="main-container">
      <Navbar className="navBar" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="content-container">
        <Sidebar className="sideBar" isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="main-content">
          <div className="profile-edit-container">
            <ProfileSideBar/>
            <ProfileEdit/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPageEdit;