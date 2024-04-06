import React, { useEffect, useState } from 'react';
import '../component_css/Sidebar.css';
import { sideBarItem } from './sideBarItem'; // Ensure this path is correct
import { useHistory } from 'react-router-dom';
import { SignOut, XCircle } from "@phosphor-icons/react"; // Removed unused import List
import logo from './unnamed.png'; // Ensure this path is correct
import { useSideBarContext } from './SideBarContext'; // Ensure this path is correct
import { useUser } from '../../userContext';
const Sidebar = () => {
  const { isOpen, setIsOpen } = useSideBarContext();
  const history = useHistory();
  const [profile, setProfile] = useState({ name: "Loading...", picture: "https://via.placeholder.com/150" });
  const { username, setUsername } = useUser();
  
  useEffect(() => {
    
    
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await fetch(`http://localhost:8000/api/userapi/fetchUser?username=${username}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setProfile({ name: data.username, picture: data.picture || "https://via.placeholder.com/150" });
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
    };

    if (isOpen && username) {
      fetchProfile();
      console.log(username);
    }
  }, [isOpen,username]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
    setUsername('');
  };

  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        {isOpen && <img src={logo} alt="Knot" className="knot-logo" />}
        <button onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)} className="List-icon-button">
          <XCircle size={24} className="List-icon" /> {/* Ensure your icon supports size prop */}
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
                  onClick={() => history.push(item.link)}>
                    <div id="icon">{item.icon}</div>
                    <div id="title">{item.title}</div>
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
                <SignOut size={24} className="logout-svg" /> {/* Ensure your icon supports size prop */}
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
