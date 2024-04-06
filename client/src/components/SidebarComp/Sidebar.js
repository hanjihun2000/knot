import React from 'react';
import '../component_css/Sidebar.css';
import {sideBarItem} from './sideBarItem';
import { useHistory } from 'react-router-dom';
import { SignOut, List, XCircle} from "@phosphor-icons/react";
import logo from './unnamed.png' 
import { useSideBarContext } from './SideBarContext';
/*import {ReactComponent as icon} from '../assets/knotlogo.svg';*/


const Sidebar =  () => {
  const { isOpen, setIsOpen } = useSideBarContext(); // Use context to get state and updater
  const history = useHistory(); // Use the useHistory hook to programmatically navigate

  const handleLogout = () => {
    // Clear the authentication token
    localStorage.removeItem('token');

    // Redirect to the login page
    history.push('/login');
  };

  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        {isOpen && <img src={logo} alt="Knot" className="knot-logo" />}
        <button onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)} className="List-icon-button">
          <XCircle className="List-icon" />
        </button>
      </div>
      <div className="sidebar-content">
        {isOpen && (
          <>
            <button className="menu-item-button-create" onClick={() => history.push("/create")}>create</button>
            <ul className="sidebar-list">
              {sideBarItem.map((item, index) => (
                  <li 
                  key={index} 
                  className="row"
                  id={window.location.pathname === item.link ? "active" : ""}
                  onClick={() => history.push(item.link)}>
                    <div id="menu-item-icon">{item.icon}</div>
                    <div id="menu-item-text">{item.title}</div>
                  </li>
              ))}
            </ul>
            <div className="menu-bottom-part">
              <div className="profile-section" onClick={() => history.push("/profile")}>
                  <img src="https://via.placeholder.com/150" alt="Profile" className="profile-pic" />
                  <div className="profile-name">Profile Name</div> {/* Ideally, replace with the actual profile name */}
              </div>
              <hr className="separator" />
              <button className="logout" onClick={handleLogout}>
                <SignOut className="logout-svg"/>
                Logout
              </button> 
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
