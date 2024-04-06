import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('');

  const value = {
    username,
    setUsername,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
