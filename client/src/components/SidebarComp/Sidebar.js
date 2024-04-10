import React, { useEffect } from 'react';
import '../component_css/Sidebar.css';
import { sideBarItemUser } from './sideBarItemUser';
import{ adminSidebarList } from '../admin/AdminSidebarList';
import { useHistory } from 'react-router-dom';
import { SignOut, XCircle } from "@phosphor-icons/react";
import logo from './knotlogo.png';
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
  useEffect(() => {
    console.log('User state updated:', user);
  }, [user]);

  const getSidebarItems = () => {
    console.log("testing1",user.accountType);
    return user.accountType === 'admin' ? adminSidebarList : sideBarItemUser;
  };

  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        {isOpen && <img src={logo} alt="Knot" className="knot-logo" />}
      </div>
      <div className="sidebar-content">
        {isOpen && (
          <>

           <NavLink to="/create-post">         
            <button className="menu-item-button-create" >Create</button>
            </NavLink>
            <ul className="sidebar-list">
              {getSidebarItems().map((item, index) => (  //will be changed to sideBarItemAdmin
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
            <NavLink to={`/profile/${user.username}`} id = "nav-none" >

              <div className="profile-section" >
                <img src={user.profilePicture} alt="Profile" className="profile-pic" />
                <div className="profile-name">{user.username || "Loading..."}</div>
              </div>
              </NavLink>
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