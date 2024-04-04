import React from 'react';
import '../component_css/Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <button className="menu-item-create">create</button>
      <button className="menu-item">home page</button>
      <button className="menu-item">search</button>
      <button className="menu-item">settings</button>
      <button className="logout">Logout</button>
    </nav>
  );
};

export default Sidebar;