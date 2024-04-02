import React, { useState } from 'react';
import './SignUpForm.css'; // Make sure to create a corresponding CSS file
import toggleVisi from './OIP.jpg'

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const handleSignUp = (event) => {
    event.preventDefault();
    // Handle the sign-up logic here
    console.log(email, username, password, confirmPassword);
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  return (
    <div className = "root">
    <div className="signup-form-container">
      <div className="signup-form-header">
        <span className="back-arrow">←</span>
        <h1>Knot</h1>
        <p>Weaving Stories, Building Communities</p>
      </div>
      <form className="signup-form" onSubmit={handleSignUp}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
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
        <div className = "password-container">
        <input
          type={confirmPasswordShown ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <img className = 'toggle-vis' src={toggleVisi} alt="Show/Hide" onClick={toggleConfirmPasswordVisibility} />
        </div>
        <button type="submit">Sign up</button>
      </form>
      <div className="terms">
        <a href="/terms">terms and agreement</a>
      </div>
      <div className="login-redirect">
        Already have an account? <a href="/login">Click here to log in</a>
      </div>
    </div>
    </div>
  );
}
export default SignUpForm;