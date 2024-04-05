import React from 'react';
import '../component_css/ProfileSideBar.css'; // Ensure to create this CSS file

const ProfileSidebar = () => {
  return (
    <aside className="profile-sidebar">
      
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          <li className="sidebar-nav-item">
            <a href="/edit-profile" className="sidebar-nav-link active">Edit Profile</a>
          </li>
          <li className="sidebar-nav-item">
            <a href="/privacy-settings" className="sidebar-nav-link">Privacy Settings</a>
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

export default ProfileSidebar;