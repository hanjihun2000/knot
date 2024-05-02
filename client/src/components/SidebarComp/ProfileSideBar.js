import React from "react";
import "../component_css/ProfileSideBar.css"; // Ensure to create this CSS file
import { NavLink } from "react-router-dom";
const ProfileSidebar = () => {
  return (
    <aside className="profile-sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          <li className="sidebar-nav-item">
            <NavLink
              to="/settings/profile-edit"
              activeClassName="sidebar-nav-link active"
              className="sidebar-nav-link"
            >
              Edit Profile
            </NavLink>
          </li>
          <li className="sidebar-nav-item">
            <NavLink
              to="/settings/privacy-settings"
              activeClassName="sidebar-nav-link active"
              className="sidebar-nav-link"
            >
              Privacy Settings
            </NavLink>
          </li>
          <li className="sidebar-nav-item">
            <NavLink
              to="/settings/theme-settings"
              activeClassName="sidebar-nav-link active"
              className="sidebar-nav-link"
            >
              Theme Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
