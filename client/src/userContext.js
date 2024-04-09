import React, { createContext, useContext, useState, useEffect } from 'react';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: '',
    profilePicture: "https://via.placeholder.com/150",
    bio: '',
    followers: [],
    following: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUser((currentUser) => ({ ...currentUser, username: storedUsername }));
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user.username) {
      fetchProfile();
    }
  }, [user.username]);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/userapi/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      let profilePictureURL = "https://via.placeholder.com/150"; // Default/fallback image URL
      if (data.profilePicture && data.profilePicture.buffer) {
        const byteArray = new Uint8Array(data.profilePicture.buffer.data);
        const blob = new Blob([byteArray], { type: data.profilePicture.mimetype });
        profilePictureURL = URL.createObjectURL(blob);
      }
      setUser({
        username,
        profilePicture: profilePictureURL,
        bio: data.bio || '',
        followers: data.followers || [],
        following: data.following || [],
        accountType: data.accountType
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser({
      username: '',
      profilePicture: "https://via.placeholder.com/150",
      bio: '',
      followers: [],
      following: [],
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

        if (!response.ok) throw new Error('Failed to fetch user profile.');

        const data = await response.json();
        let profilePictureURL = "https://via.placeholder.com/150"; // Default/fallback image URL
        if (data.profilePicture && data.profilePicture.buffer) {
          const byteArray = new Uint8Array(data.profilePicture.buffer.data);
          const blob = new Blob([byteArray], { type: data.profilePicture.mimetype });
          profilePictureURL = URL.createObjectURL(blob);
        }
        setUser((currentUser) => ({
          ...currentUser,
          profilePicture: profilePictureURL,
          bio: data.bio || '',
          followers: data.followers || [],
          following: data.following || [],
        }));
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const value = {
    user,
    setUser,
    isLoading,
    error,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const UserContext = createContext();

export const useUser = () => useContext(UserContext);
