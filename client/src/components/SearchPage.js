import React, { useState } from 'react';
import Sidebar from './SidebarComp/Sidebar';
import Navbar from './Navbar';
import './component_css/MainPage.css';
import FriendLists from './friendlist';
// import NotificationList from './notification';
import SearchComponent from './SearchComponent';

const SearchPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="main-container">
    <Navbar className="navBar" isOpen={isOpen} setIsOpen={setIsOpen} />
    <div className="content-container">
      <Sidebar className="sideBar" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="main-content">
          <div className="admin-view-user-container"> 
            <SearchComponent/>
          </div>
      </div>
      <FriendLists className="friend-list"/>
    </div>
  </div>
  );
};

export default SearchPage;
