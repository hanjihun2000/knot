import React, { useState } from 'react';
import Sidebar from '../SidebarComp/Sidebar';
import ProfileSettings from '../ProfileSettings';
import Navbar from '../Navbar';
import AdminProfileSettings from './adminSettingSideBar';
import FriendLists from '../friendlist';
import ViewReportedPosts from './viewReportedPosts';

import '../component_css/MainPage.css';





const ViewReportedUserPage = () => {

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
          <div className="profile-edit-container"> {/* change name to admin container*/ }
            <AdminProfileSettings/>
            <ViewReportedPosts/>
          </div>
          
        </div>
          <FriendLists className="friend-list"/>
      </div>
    </div>
  );
}

export default ViewReportedUserPage;