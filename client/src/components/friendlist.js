import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../components/component_css/FriendList.css";
import { useUser } from "../userContext";
import { ArrowsClockwise } from "@phosphor-icons/react";

const FriendLists = () => {
  const [friendList, setFriendList] = useState([]);
  const { user } = useUser();


  const sendMessage = async (receiverUsername) => {
    // Prompt the user for a message
    const messageText = window.prompt("Enter your message:");
    if (messageText === null || messageText.trim() === "") {
      alert("You must enter a message to send.");
      return; // Exit if no message is entered
    }
  
    const formData = new FormData();
    formData.append('sender', user.username); // Sender username from context
    formData.append('receiver', receiverUsername); // Receiver username passed to the function
    formData.append('messageText', messageText);
  
    try {
      const response = await fetch('http://localhost:3000/api/message/sendMessage', {
        method: 'POST',
        body: formData,
      });
  
      const responseData = await response.json();
      if (response.ok) {
        alert('Message sent successfully!');
        console.log(responseData);
        // Any additional logic after a successful send
      } else {
        // Handle server errors or validation errors
        alert(`Failed to send message: ${responseData.message}`);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('An error occurred while trying to send the message.');
    }
  };

  
  const fetchFriendList = () => {
    fetch(
      `http://localhost:3000/api/userapi/viewFollowing?username=${user.username}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          // Handle the case where the response is not an array
        } else {
          data.map((user) => {
            if (!user.profilePicture || !user.profilePicture.buffer) {
              user.filtered = true;
            }
            else {
              const byteArray = new Uint8Array(user.profilePicture.buffer.data);
              const blob = new Blob([byteArray], { type: user.profilePicture.mimetype });
              user.profilePicture.buffer = URL.createObjectURL(blob);
            }
          });
          const result = data.filter((user) => user.filtered !== true);
          setFriendList(result);
        }
      })
      .catch((error) => console.error("Fetching error:", error));
  };

  // Fetch data only once when the component mounts
  useEffect(() => {
    fetchFriendList();
  }, [user]);

  return (
    <nav className="FriendListsContainer">
      <ul className="FriendLists">
        <li key='refresh className = "row' className="refresh-border">
          <button onClick={fetchFriendList} className="refresh-button">
            <ArrowsClockwise className="reload-icon" />
          </button>
        </li>
        {friendList.map((friend, index) => (
          <li key={index} className="row">
            <NavLink to={`/profile/${friend.username}`} className="nav-link">
              <div id="profilePicture" onClick={() => sendMessage(friend.username)}>
                <img
                  src={friend.profilePicture.buffer}
                  alt={friend.username}
                  className="profile-picture"
                />
              </div>
              <div id="username">{friend.username}</div>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FriendLists;
