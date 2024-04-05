import React, { useState } from 'react';
import './component_css/LogInForm.css'; // Make sure to create a corresponding CSS file
import logo from '../unnamed.png';
import toggleVisi from '../OIP.jpg';
import {Link} from 'react-router-dom';

function LogInForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);


  const handleLogIn = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    // Make a POST request to the server's login endpoint
    try {
      const response = await fetch('http://localhost:8000/login', { // Make sure the URL matches your server's URL (you might need to prefix with your server's base URL)
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Login successful:', data);
        // Here you can handle successful login, e.g., redirecting the user, storing the login token, etc.
        // For example, using localStorage to store the token (assuming the server sends one)
        localStorage.setItem('token', data.token);
        // Redirect user or update UI
      } else {
        console.error('Login failed:', data.message);
        // Handle login failure, e.g., showing an error message to the user
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle network errors, show feedback to the user
    }
  };


  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };
  
  

  return (
    <div className = "root">
      <div className='header'>
        
      </div>
    <div className="signup-form-container">
    <img className = 'knot-logo' src={logo} alt="Show/Hide"  />
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
        <div className = "password-container">
        <input
          type={passwordShown ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <img className = 'toggle-vis' src={toggleVisi} alt="Show/Hide" onClick={togglePasswordVisibility} />
        </div>
        
        <button className="submit-log" type="submit">log in</button>
      </form>
      
      
     
    </div>
    <div className="signin-redirect">
        Haven't got an account?&nbsp;  <Link to= "/" ><a href="/login"> Click here to sign up</a></Link>
      </div>     
    </div>
  );
}
export default LogInForm;