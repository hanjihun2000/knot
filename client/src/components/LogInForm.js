import React, { useState } from 'react';
import '../component_css/LogInForm.css'; // Make sure to create a corresponding CSS file
import logo from '../unnamed.png'
import toggleVisi from '../OIP.jpg'
import {Link} from 'react-router-dom'

function LogInForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);


  const handleSignUp = (event) => {
    event.preventDefault();
    // Handle the sign-up logic here
    console.log(username, password);
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
      <form className="login-form" onSubmit={handleSignUp}>
        
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