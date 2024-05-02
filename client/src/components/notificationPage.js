import React, { useState } from "react";
import Sidebar from "./SidebarComp/Sidebar";
import Navbar from "./Navbar";
import "./component_css/MainPage.css";
import FriendLists from "./friendlist";
import NotificationList from "./notification";

const MainPageThemes = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="main-container">
      <Navbar className="navBar" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="content-container">
        <Sidebar className="sideBar" isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="main-content">
          <div className="notification-list-container">
            <NotificationList />
          </div>
        </div>
        <FriendLists className="friend-list" />
      </div>
    </div>
  );
};

export default MainPageThemes;
