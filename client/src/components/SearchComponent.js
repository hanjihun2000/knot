// import "../component_css/SearchPage.css";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
// import { useUser } from '../userContext';
import React, { useState, useEffect } from "react";
// import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const SearchPage = () => {
  const [ searchUsersList, setSearchUsers ] = useState([]);
  const [ searchTerm, setSearchTerm ] = useState('');
  const history = useHistory();

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page
    history.push(`/search/${searchTerm}`); // Navigate to the search page
  };

  const fetchSearchList = () => {
    fetch(`http://localhost:8000/api/userapi/searchUsers?searchTerm=${searchTerm}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          // Handle the case where the response is not an array
        } else {
          data.map((user) => {
            
            if (!user.profilePicture || !user.profilePicture.buffer) {
              user.filtered = true;
            }
            else {
              console.log(user.username);
              const byteArray = new Uint8Array(user.profilePicture.buffer.data);
              const blob = new Blob([byteArray], { type: user.profilePicture.mimetype });
              user.profilePicture.buffer = URL.createObjectURL(blob);
            }
          });
          const result = data.filter((user) => user.filtered !== true);
          setSearchUsers(result);
        }
      })
      .catch(error => console.error('Fetching error:', error));
  };

  useEffect(() => {
    if (!searchTerm) {
      // Handle the case where there is no searchTerm
      setSearchUsers([]);
    } else {
      // Handle the case where there is a searchTerm
      fetchSearchList();
    }
  }, [searchTerm]);

  return (
    <div className="search-page">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for usernames..."
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <button type="submit">Search</button>
      </form>
      <div className="results-container">
        {!searchTerm ? (
          <p>Type something to find new friends</p>
        ) : searchUsersList && searchUsersList.length > 0 ? (
          searchUsersList.map((user) => (
            <div key={user.username} className="user-card">
              <NavLink
                to={`/profile/${user.username}`}
                className="profile-link"
              >
                <img
                  src={user.profilePicture.buffer}
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

