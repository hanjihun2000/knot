import React, { useState } from 'react';
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
  const { setUsername: setGlobalUsername } = useUser(); // Destructure and rename to avoid name conflict
  const handleLogIn = async (event) => {
    event.preventDefault();

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
        console.log('Login successful:', data);
        console.log(username)
        setGlobalUsername(username); // Update global username
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true); // Update state to indicate user is logged in
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  // If login is successful, redirect to the home page
  if (isLoggedIn) {
    return <Redirect to="/home" />;
  }

  return (
    <div className="root">
      <div className='header'></div>
      <div className="signup-form-container">
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
