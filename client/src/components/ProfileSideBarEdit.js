import React from 'react';
import './component_css/ProfileSideBar.css'; // Ensure to create this CSS file
import {Link} from 'react-router-dom'
const ProfileSidebarEdit = () => {
  return (
    <aside className="profile-sidebar">
      
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          <li className="sidebar-nav-item">
          <Link to= "/home" >
            <a href="/home" className="sidebar-nav-link active">Edit Profile</a>
            </Link>
          </li>
          <li className="sidebar-nav-item">
          <Link to= "/privacy-settings" >
            <a href="/privacy-settings" className="sidebar-nav-link">Privacy Settings</a></Link>
          </li>
          <li className="sidebar-nav-item">
            <a href="/theme-settings" className="sidebar-nav-link">Theme Settings</a>
          </li>
          {/* Add additional list items as needed */}
        </ul>
      </nav>
    </aside>
  );
};

export default ProfileSidebarEdit;