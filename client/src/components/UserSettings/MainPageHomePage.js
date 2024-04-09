import React, { useState, useEffect } from 'react';
import Sidebar from '../SidebarComp/Sidebar';
import Navbar from '../Navbar';
import ProfileSideBarEdit from '../SidebarComp/ProfileSideBar';
import FriendLists from '../friendlist';
import '../component_css/MainPage.css';
import MainPagePostInt from './MainPagePostInt';
import { useUser } from '../../userContext';





const MainPageHomePage= () => {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [posts, setPosts] = useState([]);
  const {user} = useUser();
  const username = user.username;

  //fetch posts
  useEffect(() => {
    console.log(username)
    if (username === '') {
      return;
    }
    let uri = `http://localhost:8000/api/postapi/recommendPosts?username=${username}`
    console.log(uri)
    fetch(uri) // Fetch posts for the user
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setPosts(data.posts);
        } else {
          alert(data.message);
        }
      }).catch((error) => {
        console.error('There was an error!', error);
      });
  }, [username]);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  return (
    <div className="main-container">
      <Navbar className="navBar" isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="content-container">
        <Sidebar className="sideBar" isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="main-content">
          
          {posts.map((post, index) => (
            <MainPagePostInt key={index} post={post} />
          ))}
          
        </div>
          <FriendLists className="friend-list"/>
      </div>
    </div>
  );
}

export default MainPageHomePage;