import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../components/component_css/Notification.css';
import { useUser } from '../userContext';
import { ArrowsClockwise } from "@phosphor-icons/react";

const RequestList = () => {
  const [requestFollower, setRequestFollower] = useState([]);
  const { user } = useUser();
  const [fetchTrigger, setFetchTrigger] = useState(false);

  const fetchRequestFollower = () => {
    console.log(user.username);
    fetch(`http://localhost:8000/api/followapi/viewFollowRequests?username=${user.username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        
          setRequestFollower(data.message);
        
      })
      .catch(error => console.error('Fetching error:', error));
  };

  const handleFollowRequest = (sender, receiver, accept) => {
    fetch('http://localhost:8000/api/followapi/handleFollowRequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: sender,
        receiver: receiver,
        accept: accept,
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  // Fetch data only once when the component mounts
  useEffect(() => {
    fetchRequestFollower();
  }, []);
//there might be stuff to change here ask daniel later
  function createImageObjectURL(userProfile) {
    if (!userProfile.profilePicture || !userProfile.profilePicture.buffer) {
      return 'path/to/default/image.png'; // Fallback if no picture
    }
    
    const byteArray = new Uint8Array(userProfile.profilePicture.buffer.data);
    const blob = new Blob([byteArray], { type: userProfile.profilePicture.mimetype });
    const imageObjectURL = URL.createObjectURL(blob);
    return imageObjectURL;
  }

  return (
    <nav className="Notification-container">
      <ul className="request-list">
        <li key='refresh' className="row-refresh-border">
          <button onClick={fetchRequestFollower} className="refresh-button-notification">
            <ArrowsClockwise className='refresh-icon'/>
          </button>
        </li>
        {requestFollower.map((requestedUser, index) => {
            return (
                <li key={index} className="notification-row">
                <NavLink to={`/profile/${requestedUser.username}`} className="notification-nav-link">
                    <div id="notification-profilePicture-container">
                    <img className="notification-profilePicture" src={createImageObjectURL(requestedUser) || 'path/to/default/image.png'} alt={requestedUser.username}/>
                    </div>
                    <div id="username" className="notification-user">{requestedUser.username}</div>
                </NavLink>
                <div id="notification-button-container">
                    <button className="acceptAndReject-button accept-button" onClick={() => handleFollowRequest(user.username, requestedUser.username, true)}>accept</button>
                    <button className="acceptAndReject-button reject-button" onClick={() => handleFollowRequest(user.username, requestedUser.username, false)}>reject</button>
                </div> 
                </li>
            );
            })}
      </ul>
      
    </nav>
  );
};

export default RequestList;