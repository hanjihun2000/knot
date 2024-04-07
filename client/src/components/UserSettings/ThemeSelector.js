import React from 'react';
import '../component_css/ThemeSelector.css'; // Make sure to create a corresponding CSS file

function ThemeSelector() {
  const setTheme = theme => {
    // Set the theme attribute on the document element
    document.documentElement.setAttribute('data-theme', theme);

    // Prepare your API request here. Assume you have the user's token.
    const token = localStorage.getItem('userToken'); // Example: Getting token from localStorage

    // Set up your API request with the user's selected theme
    fetch('http://localhost:8000/api/userapi/editUserProfile', {
      method: 'PUT', // Assuming the method to update is PUT
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Assuming you use Bearer token for authorization
      },
      body: JSON.stringify({
        theme: theme, // Sending the selected theme to the server
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // or handle success
    })
    .then(data => console.log(data)) // Success handling
    .catch(error => console.error('Error updating theme:', error)); // Error handling
  };
  
  return (
    <div className="theme-selector">
      <h2>Theme setting</h2>
      <p>Let’s change up the theme</p>
      <div className="theme-buttons">
        <button className="theme-button white" onClick={() => setTheme('white')}>White</button>
        <button className="theme-button dark" onClick={() => setTheme('dark')}>Dark</button>
        <button className="theme-button spring" onClick={() => setTheme('spring')}>Spring</button>
        <button className="theme-button summer" onClick={() => setTheme('summer')}>Summer</button>
      </div>
    </div>
  );
}

export default ThemeSelector;
