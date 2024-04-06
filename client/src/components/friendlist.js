import React from 'react';
import { NavLink } from 'react-router-dom';
import '../components/component_css/FriendList.css';
import { FriendListItem } from './UserSettings/FriendListitem';

const FriendLists = () => {

  return (
    <nav className="FriendListsContainer">
      <ul className = "FriendLists">
        {FriendListItem.map((user, index) => (
          <li key={index} className="row">
            <NavLink to={`/profile/${user.name}`} className="nav-link">
              <div id="profilePicture">
                <img src={user.profilePicture}/>
              </div>
              <div id="username">{user.name}</div>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FriendLists;