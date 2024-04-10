import './userPreview.css';
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
        setUsers(updatedUsers);
        console.log(users);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  const deleteUser = async (username) => {
    try {
      if (!window.confirm(`Are you sure you want to delete user ${username}?`)) return;
      const response = await fetch('http://localhost:8000/api/adminapi/deleteUser', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Include any other headers like Authorization if needed
        },
        body: JSON.stringify({username: username}),
      });
  
      const result = await response.json();
  
      console.log(result);
  
      if (response.ok) {
        console.log('Success:', result.message);
        alert(`User ${username} deleted successfully`)
        setUsers(prevUsers => prevUsers.filter(user => user.username !== username));
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);


  return (
    <div className="userPreview-page">
      <h2>View User</h2>
        <div className="userPreview-container">
          <ul className="user-list">
            {users.filter(user => user !== undefined)
            .map((user) => {              
              return (
                <li key={user.id} className="user-item">
                  <div className="userPreview-user-info">
                    <NavLink to={`/profile/${user.username}`} className="userComponent" >
                      <div id="user-profile-picture">
                        <img 
                          src={user.profilePicture || '../../default-profile-picture.png'}
                        />
                      </div>
                      <div id="userPreview-username">{user.username}</div>
                    </NavLink>
                    <button className="delete-button" onClick={() => deleteUser(user.username)}>Delete</button>
                  </div>
                </li>
              );
            })}
          </ul>  
        </div>
    </div>
  );
};

export default UserPreview;
