import React, { useState,useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom'; // Import Redirect here
import './component_css/LogInForm.css';
import logo from '../unnamed.png';
import toggleVisi from '../OIP.jpg';
import { useUser } from '../userContext';
function LogInForm() {
  


  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const { user, login, logout } = useUser();
  useEffect(() => {
    console.log('Login state changed:', isLoggedIn);
    if (isLoggedIn) {
      // Your redirection logic
    }
  }, [isLoggedIn]);
  const handleLogIn = async (event) => {
    event.preventDefault();
    const loggedIn = await login(username, password); // Use login from UserContext
    setIsLoggedIn(!loggedIn); // Update state based on the result of the login attempt
    console.log(loggedIn); //
  };


  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  // If login is successful, redirect to the home page
  if (isLoggedIn) {
    return <Redirect to="/settings/profile-edit" />;
  }

  return (
    <div className="root">
      <div className='header'></div>
      <div className="login-form-container">
        <img className='knot-logo' src={logo} alt="Show/Hide" />
        <div className="signup-form-header">
          <h1>Knot</h1>
        </div>
        <form className="login-form" onSubmit={handleLogIn}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <div className="password-container">
            <input
              type={passwordShown ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <img className='toggle-vis' src={toggleVisi} alt="Show/Hide" onClick={togglePasswordVisibility} />
          </div>
          <button className="submit-log" type="submit">log in</button>
        </form>
      </div>
      <div className="signin-redirect">
        Haven't got an account?&nbsp;<Link to="/">Click here to sign up</Link>
      </div>
    </div>
  );
}

export default LogInForm;
