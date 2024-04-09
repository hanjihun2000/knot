import React, { useState } from 'react';
import Sidebar from '../SidebarComp/Sidebar';
import Navbar from '../Navbar';
import FriendLists from '../friendlist';
import '../component_css/MainPage.css';
import '../component_css/FriendList.css';

import SingPagePost from './singPagePost';





const SingPage= () => {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  return (
    <div className="singpage-container">
      <Navbar className="navBar" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="singpage-content-container">
        
        <div className="singpage-content">
          
           
            <SingPagePost/>
          
          
        </div>
          
      </div>
    </div>
  );
}

export default SingPage;