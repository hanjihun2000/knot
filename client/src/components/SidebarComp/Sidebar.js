import React, { useEffect } from 'react';
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
  const { user, logout } = useUser(); 

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

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

           <NavLink to="/createPost">         
            <button className="menu-item-button-create" >Create</button>
            </NavLink>
            <ul className="sidebar-list">
              {sideBarItem.map((item, index) => (
                <li 
                  key={index} 
                  className="row"
                  id={window.location.pathname === item.link ? "active" : ""}
                  >
                    <NavLink to={item.link} className="nav-link-none" >
                      <div id="icon">{item.icon}</div>
                      <div id="title">{item.title}</div>
                    </NavLink>
                </li>
              ))}
            </ul>
            <div className="menu-bottom-part">
              <div className="profile-section" onClick={() => history.push("/profile")}>
                <img src={user.profilePicture} alt="Profile" className="profile-pic" />
                <div className="profile-name">{user.username || "Loading..."}</div>
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