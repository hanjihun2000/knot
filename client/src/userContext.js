import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(() => {
    // Attempt to get a saved username from localStorage on initial render
    const localUsername = localStorage.getItem('username');
    return localUsername || ''; // If there's no username in localStorage, default to an empty string
  });

  const value = { username, setUsername };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};