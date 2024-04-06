import React, { useEffect, useState } from 'react';
import '../component_css/Sidebar.css';
import { sideBarItem } from './sideBarItem';
import { useHistory } from 'react-router-dom';
import { SignOut, XCircle } from "@phosphor-icons/react";
import logo from './unnamed.png';
import { useSideBarContext } from './SideBarContext';
import { useUser } from '../../userContext';
import { NavLink } from 'react-router-dom';
const Sidebar = () => {
  const { isOpen, setIsOpen } = useSideBarContext();
  const history = useHistory();
  const [profile, setProfile] = useState({ name: "Loading...", picture: "https://via.placeholder.com/150" });
  const { username, setUsername } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername('');
    setProfile({ name: "Loading...", picture: "https://via.placeholder.com/150" }); // Reset profile on logout
    history.push('/login');
  };

  useEffect(() => {
    // On component mount, read the username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [setUsername]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token && username) {
        try {
          const response = await fetch(`http://localhost:8000/api/userapi/fetchUser?username=${username}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setProfile({ name: data.username, picture: data.picture || "https://via.placeholder.com/150" });
          } else {
            // Handle HTTP errors here
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          // Handle fetch errors here
        }
      }
    };

    if (isOpen && username) {
      fetchProfile();
    }
  }, [isOpen, username]);

  

  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        {isOpen && <img src={logo} alt="Knot" className="knot-logo" />}
        <button onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)} className="List-icon-button">
          <XCircle size={24} className="List-icon" />
        </button>
      </div>
      <div className="sidebar-content">
        {isOpen && (
          <>
            <button className="menu-item-button-create" onClick={() => history.push("/create")}>Create</button>
            <ul className="sidebar-list">
              {sideBarItem.map((item, index) => (
                <li 
                  key={index} 
                  className="row"
                  id={window.location.pathname === item.link ? "active" : ""}
                  >
                    <NavLink to="/mainPage" className="nav-link-none" >
                  
                
                    <div id="icon">{item.icon}</div>
                    <div id="title">{item.title}</div>
                    </NavLink>
                </li>
              ))}
            </ul>
            <div className="menu-bottom-part">
              <div className="profile-section" onClick={() => history.push("/profile")}>
                <img src={profile.picture} alt="Profile" className="profile-pic" />
                <div className="profile-name">{profile.name}</div>
              </div>
              <hr className="separator" />
              <button className="logout" onClick={handleLogout}>
                <SignOut size={24} className="logout-svg" /> logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
