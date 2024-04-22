import React from 'react';
import '../component_css/ThemeSelector.css'; // Make sure to create a corresponding CSS file
import { useUser } from '../../userContext';
function ThemeSelector() {
  const { user,setUser } = useUser(); 
  let theme = !!localStorage.getItem("theme");

  const setTheme = async (theme) => {
    // Set the theme attribute on the document element
    const apiUrl = 'http://localhost:8000/api/userapi/editUserProfile';

    // Use FormData to handle file uploads
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('theme', theme);

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT', // Make sure to use 'PUT' if that's what your backend is expecting
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
       
       
        setUser((currentUser) => ({
          ...currentUser,
          
          theme: theme
        }));
        
      } else {
        alert(data.message || 'An error occurred during edit');
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert('An unexpected error occurred. Please try again later.');
    }
    localStorage.setItem('theme',theme);
  };

    
   
    // Set up your API request with the user's selected theme
   

  
  return (
    <div className="theme-selector">
      <h2 classname =" theme-setting-title">Theme setting</h2>
      <p>Let’s change up the theme</p>
      <div className="theme-buttons">
        <button className="theme-button white" onClick={() => setTheme('white')}>Classic</button>
        <button className="theme-button dark" onClick={() => setTheme('dark')}>Dark</button>
        <button className="theme-button spring" onClick={() => setTheme('spring')}>Spring</button>
        <button className="theme-button summer" onClick={() => setTheme('summer')}>Summer</button>
      </div>
    </div>
  );
}

export default ThemeSelector;



