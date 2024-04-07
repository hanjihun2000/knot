import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../components/component_css/FriendList.css';

const FriendLists = () => {
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const username = 'followertest'; // replace with the actual username
    fetch(`http://localhost:8000/api/userapi/viewFollowing?username=${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setFriendList(data))
      .catch(error => console.error(`Fetch Error =\n`, error));
  }, []);

  return (
    <nav className="FriendListsContainer">
      <ul className = "FriendLists">
        {friendList.map((user, index) => (
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