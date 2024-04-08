import React, { useState } from 'react';
import Sidebar from './SidebarComp/Sidebar';
import Navbar from './Navbar';
import ProfileSideBarEdit from './SidebarComp/ProfileSideBar';
import './component_css/MainPage.css';
import FriendLists from './friendlist';
import NotificationList from './notification';
import { useUser } from '../userContext';


const MainPageThemes = () => {
  const [isOpen, setIsOpen] = React.useState(false);


  return (

    <div className="main-container">
    <Navbar className="navBar" isOpen={isOpen} setIsOpen={setIsOpen} />
    <div className="content-container">
      <Sidebar className="sideBar" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="main-content">
        <div className="profile-edit-container">
          <div className="notification-list-container">
            
            <NotificationList/>
            
          </div>
        </div>
      </div>
      <FriendLists className="friend-list"/>
    </div>
  </div>

    
  );
};

export default MainPageThemes;