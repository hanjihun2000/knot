import React from 'react';
import './adminSettingSideBar.css'; // Ensure to create this CSS file
import { NavLink } from 'react-router-dom';

const adminSettingSideBar = () => {
  return (
    <aside className="profile-sidebar">
      
      <nav className="sidebar-nav">
      <ul className="sidebar-nav-list">
          <li className="sidebar-nav-item">
            <NavLink to="/admin/adminViewUser" activeClassName="sidebar-nav-link active" className="sidebar-nav-link">
              View User
            </NavLink>
          </li>
          <li className="sidebar-nav-item">
            <NavLink to="/admin/view-reported-posts" activeClassName="sidebar-nav-link active" className="sidebar-nav-link">
              View reported user
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default adminSettingSideBar;
