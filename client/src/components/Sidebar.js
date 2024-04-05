import React from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory from 'react-router-dom'
import './component_css/Sidebar.css';

const Sidebar = () => {
  const history = useHistory(); // Use the useHistory hook to programmatically navigate

  const handleLogout = () => {
    // Clear the authentication token
    localStorage.removeItem('token');

    // Redirect to the login page
    history.push('/login');
  };

  return (
    <nav className="sidebar">
      <button className="menu-item-create">create</button>
      <button className="menu-item">home page</button>
      <button className="menu-item">search</button>
      <button className="menu-item">settings</button>
      <button className="logout" onClick={handleLogout}>Logout</button> {/* Add the onClick event handler */}
    </nav>
  );
};

export default Sidebar;
