{
  /* <div className="search-container">
                <input
                  type="text"
                  placeholder="Search for usernames..."
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  className="search-input"
                />
                <button onClick={handleSearch} className="search-button">
                  Search
                </button>
              </div> */
}

import { NavLink } from "react-router-dom/cjs/react-router-dom";
import "../component_css/SearchPage.css";
import React, { useState, useEffect } from "react";

const SearchPage = ({ users, onSearch }) => {
  return (
    <div className="search-page">
      <div className="results-container">
        {users && users.length > 0 ? (
          users.map((user) => (
            <div key={user.username} className="user-card">
              <NavLink
                to={`/profile/${user.username}`}
                className="profile-link"
              >
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="profile-picture"
                />
                <span className="username">{user.username}</span>
              </NavLink>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

// const handleSearchTermChange = (event) => {
//   setSearchTerm(event.target.value);
// };

// const handleSearch = async () => {
//   try {
//     const response = await axios.get(
//       `http://localhost:8000/api/userapi/searchUsers?username=jay&searchTerm=${searchTerm}`
//     );
//     setUsers(response.data);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//   }
// };
