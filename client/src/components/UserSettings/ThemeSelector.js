import React from 'react';
import '../component_css/ThemeSelector.css'; // Make sure to create a corresponding CSS file

function ThemeSelector() {
  const setTheme = theme => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <div className="theme-selector">
      <h2>Theme setting</h2>
      <p>Let’s change up the theme</p>
      <div className="theme-buttons">
        <button className="theme-button white" onClick={() => setTheme('white')}>White</button>
        <button className="theme-button dark" onClick={() => setTheme('dark')}>Dark</button>
        <button className="theme-button retro" onClick={() => setTheme('retro')}>Retro</button>
        <button className="theme-button summer" onClick={() => setTheme('summer')}>Summer</button>
      </div>
    </div>
  );
}

export default ThemeSelector;
