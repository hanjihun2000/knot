import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../components/component_css/FriendList.css";
import { useUser } from "../userContext";
import { ArrowsClockwise } from "@phosphor-icons/react";

const FriendLists = () => {
  const [friendList, setFriendList] = useState([]);
  const { user } = useUser();
  
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
              <div id="profilePicture">
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
