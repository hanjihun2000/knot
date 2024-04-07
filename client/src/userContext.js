import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: '',
    profilePicture: "https://via.placeholder.com/150",
    bio: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUser((currentUser) => ({ ...currentUser, username: storedUsername }));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // This effect runs when the username changes - such as when logging in
    if (user.username) {
      fetchProfile();
    }
  }, [user.username]);

  const login = async (username, password) => {
    setIsLoading(true);
    console.log('yep');
    try {
      const response = await fetch('http://localhost:8000/api/userapi/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser({
          username,
          profilePicture: data.profilePicture || "https://via.placeholder.com/150",
          bio: data.bio || '',
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        setIsLoading(false);
      } else {
        setError(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser({
      username: '',
      profilePicture: "https://via.placeholder.com/150",
      bio: '',
    });
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    const username = user.username;

    if (username && token) {
      try {
        const response = await fetch(`http://localhost:8000/api/userapi/fetchUser?username=${username}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const byteArray = new Uint8Array(data.profilePicture.buffer.data);
          const blob = new Blob([byteArray], { type: data.profilePicture.mimetype });
          const imageObjectURL = URL.createObjectURL(blob);
          setUser((currentUser) => ({
            ...currentUser,
            profilePicture: imageObjectURL,
            bio: data.bio,
          }));
        } else {
          setError('Failed to fetch user profile.');
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Make sure to expose login and logout functions via the value provided to the context
  const value = {
    user,
    setUser,
    isLoading,
    error,
    login,
    logout
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
