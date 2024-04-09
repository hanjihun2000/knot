import React from 'react';
import '../component_css/ProfileSideBar.css'; // Ensure to create this CSS file
import {Link} from 'react-router-dom'
import { NavLink } from 'react-router-dom';
const ProfileSidebar = () => {
  return (
    <aside className="profile-sidebar">
      
      <nav className="sidebar-nav">
      <ul className="sidebar-nav-list">
          <li className="sidebar-nav-item">
            <NavLink to="/settings/profile-edit" activeClassName="sidebar-nav-link active" className="sidebar-nav-link">
              View User
            </NavLink>
          </li>
          <li className="sidebar-nav-item">
            <NavLink to="/settings/privacy-settings" activeClassName="sidebar-nav-link active" className="sidebar-nav-link">
              View reported posts
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
