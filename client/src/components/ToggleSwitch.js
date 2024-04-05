import React from 'react';
import '../component_css/ToggleSwitch.css';

const ToggleSwitch = ({ isPrivate, setIsPrivate }) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
      <span className="slider"></span>
    </label>
  );
};

export default ToggleSwitch;