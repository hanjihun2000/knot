// api
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import "../component_css/SearchPage.css";
import React, { useState, useEffect } from "react";

const Searching = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/userapi/searchUsers?username=jay&searchTerm=${searchTerm}`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
};

export default Searching;