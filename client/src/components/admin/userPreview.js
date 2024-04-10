import '../component_css/ProfileEdit.css';
import React, {useState, useEffect} from 'react';
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
        const updatedUsers = await Promise.all(result.message.map((user) => {
          //set profilePicture to blob
          if (user.profilePicture && user.profilePicture.buffer) {
            const byteArray = new Uint8Array(user.profilePicture.buffer.data);
            const blob = new Blob([byteArray], {
              type: user.profilePicture.mimetype,
            });
            const imageObjectURL = URL.createObjectURL(blob);
            return {...user, profilePicture: imageObjectURL};
          } else {
            return user;
          }
        }));
        console.log(updatedUsers)
        setUsers(updatedUsers);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  useEffect(() => {
    fetchAllUsers();
  }, []);


  return (
    <div className="profile-edit">
      <h2>View User</h2>
        <div className="profile-container">
          <ul className="user-list">
            {users.map((user) => {
              return (
                <li key={user.id} className="user-item">
                  <div className="user-info">
                    <NavLink to={`/profile/${user.username}`} className="nav-link-none" >
                      <div id="user-profile-picture">
                        <img src={user.profilePicture || 'path/to/default/image.png'}/>
                      </div>
                      <div id="username">{user.username}</div>
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
