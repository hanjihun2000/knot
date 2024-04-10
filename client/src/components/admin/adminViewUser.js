import React, { useState } from 'react';
import Sidebar from '../SidebarComp/Sidebar';
import AdminSettingSideBar from './adminSettingSideBar';
import Navbar from '../Navbar';
import FriendLists from '../friendlist';
import UserPreview from './userPreview';

import '../component_css/MainPage.css';





const AdminViewUser = () => {

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
    <div className="admin-main-container">
      <Navbar className="navBar" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="content-container">
        <Sidebar className="sideBar" isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="main-content">
          <div className="admin-view-user-container"> {/* change name to admin container*/}
            <AdminSettingSideBar/>
            <UserPreview/>
          </div>
          
        </div>
          <FriendLists className="friend-list"/>
      </div>
    </div>
  );
}

export default AdminViewUser;