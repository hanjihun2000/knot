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
        if (Array.isArray(data)) {
          setRequestFollower(data);
        } else {
          console.error('There is no data:', data); //useless
          setRequestFollower(data);
        }
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
        <li key = 'refresh className = "row' className="refresh-border">
          <button onClick={fetchRequestFollower} className="refresh-button">
          </button>
        </li>
        {requestFollower.map((requestedUser, index) => (
            <li key={index} className="row">
                <NavLink to={`/profile/${requestedUser.username}`} className="nav-link">
                <div id="profilePicture">
                    <img src={createImageObjectURL(requestedUser) || 'path/to/default/image.png'} alt={requestedUser.username}/>
                </div>
                <div id="username">{requestedUser.username}</div>
                </NavLink>
                <button className="accept-button" onClick={() => handleFollowRequest(user.username, requestedUser.username, true)}>accept</button>
                <button className="reject-button" onClick={() => handleFollowRequest(user.username, requestedUser.username, false)}>reject</button>
            </li>
        ))}
      </ul>
      
    </nav>
  );
};

export default RequestList;