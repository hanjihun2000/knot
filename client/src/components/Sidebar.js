import React from 'react';
import '../component_css/Sidebar.css';
import {sideBarItem} from './sideBarItem';
import { useHistory } from 'react-router-dom';
import { SignOut} from "@phosphor-icons/react";
const Sidebar = () => {
  const history = useHistory();

  return (
    <nav className="sidebar">
      <button className="menu-item-button-create" onClick={() => history.push("/create")}>create</button>
      <ul className="sidebar-list">
      {sideBarItem.map((item, index) => {
        return (
          <li 
          key={index} 
          className="row"
          id = {window.location.pathname === item.link ? "active" : ""}
          onClick={() => history.push(item.link)}>
            <div id="menu-item-icon">{item.icon}</div>
            <div id="menu-item-text">{item.title}</div>
          </li>
        );
      })}
      </ul>
      <div className="menu-bottom-part">
        <div className="profile-section"onClick={() => history.push("/profile")}>
            <img src="https://via.placeholder.com/150" alt="Profile" className="profile-pic" />
            <div className="profile-name" >Profile Name</div> {/* replace with the actual profile name */}
        </div>
        <hr className="separator" />
        <button className="logout">
          <SignOut className="logout-svg"/>
          Logout
        </button> 
      </div>
    </nav>
  );
};

export default Sidebar;