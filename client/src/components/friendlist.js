import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../components/component_css/FriendList.css';

const  FriendLists =  () => {
  const [friendList, setFriendList] = useState([]);
  const [imageList, setImageList] = useState([]);
  useEffect( () => {
    const username = 'followertest'; // replace with the actual username
    fetch(`http://localhost:8000/api/userapi/viewFollowing?username=${username}`)
      .then(async response => {
        const data = await response.json();
        console.log(data);
       
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setFriendList(data); 
      })
       
  }, []);

  function createImageObjectURL(user) {
    // Assuming user.profilePicture contains the necessary buffer and mimetype
    if (!user.profilePicture || !user.profilePicture.buffer) return null; // Fallback if no picture
    
    const byteArray = new Uint8Array(user.profilePicture.buffer.data);
    const blob = new Blob([byteArray], { type: user.profilePicture.mimetype });
    const imageObjectURL = URL.createObjectURL(blob);
    return imageObjectURL;
  } 

  return (
    <nav className="FriendListsContainer">
      <ul className = "FriendLists">
        {friendList.map((user, index) => (

      
          <li key={index} className="row">
            <NavLink to={`/profile/${user.username}`} className="nav-link">
              <div id="profilePicture">
                <div>{user.username}</div>
                <img src={createImageObjectURL(user) || 'path/to/default/image.png'} alt={user.username}/>
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