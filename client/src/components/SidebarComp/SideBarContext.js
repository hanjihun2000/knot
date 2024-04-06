import React, { createContext, useState, useContext } from 'react';

const SideBarContext = createContext();

export const useSideBarContext = () => useContext(SideBarContext);

export const SideBarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SideBarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SideBarContext.Provider>
  );
};