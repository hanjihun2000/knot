import '../component_css/ProfileEdit.css';
import React, { useState } from 'react';
import { useUser } from '../../userContext';
import {userDemoList} from './userDemoList';
import { NavLink } from 'react-router-dom';




const UserPreview = () => {

  const [users, setUsers] = useState([]);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/adminapi/listUsers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include any other headers like Authorization if needed
        },
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        console.log('Success:', result.message);
        setUsers(result.message);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }


  return (
    <div className="profile-edit">
      <h2>View User</h2>
        <div className="profile-container">
          <ul className="user-list">
            {userDemoList.map((user) => {
              return (
                <li key={user.id} className="user-item">
                  <div className="user-info">
                    <NavLink to={`/profile/${user.username}`} className="nav-link-none" >
                      <div id="user-profile-picture">
                        <img src={user.profilePicture || 'path/to/default/image.png'}/>
                      </div>
                      <div id="username">{user.name}</div>
                    </NavLink>
                  </div>
                </li>
              );
            })}
          </ul>
          
        </div>
          
        <button type="submit" className="confirm-button">Confirm</button>
    </div>
  );
};

export default UserPreview;
