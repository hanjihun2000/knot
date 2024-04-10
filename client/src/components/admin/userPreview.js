import './userPreview.css';
import React, { useState } from 'react';
import { useUser } from '../../userContext';
import {userDemoList} from './userDemoList';
import { NavLink } from 'react-router-dom';


const UserPreview = () => {
  return (
    <div className="userPreview-page">
      <h2>View User</h2>
        <div className="userPreview-container">
          <ul className="user-list">
            {userDemoList.map((user) => {
              return (
                <li key={user.id} className="user-item">
                  <div className="userPreview-user-info">
                    <NavLink to={`/profile/${user.username}`} className="userComponent" >
                      <div id="user-profile-picture">
                        <img 
                          src={user.profilePicture || 'path/to/default/image.png'}
                        />
                      </div>
                      <div id="userPreview-username">{user.name}</div>
                    </NavLink>
                    <button className="delete-button">Delete</button>
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
