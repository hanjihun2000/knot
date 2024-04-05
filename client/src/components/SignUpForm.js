import React, { useState } from 'react';
import './component_css/SignUpForm.css'; // Make sure to create a corresponding CSS file
import toggleVisi from '../OIP.jpg';
import { Link } from 'react-router-dom';

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [isTermsVisible, setIsTermsVisible] = useState(false); //

  
    const handleSignUp = async (event) => {
      event.preventDefault();
  
      // Check if the passwords entered in both password fields match.
      // Alert the user and prevent form submission if they do not.
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return; // Stop the function if the passwords don't match.
      }
  
      // Define the API endpoint where the form data should be sent.
      const apiUrl = 'http://localhost:3000/api/userapi/register';
  
      // Set up the request options for the fetch call.
      // This includes the method (POST), headers, and the body,
      // which contains the JSON stringified form data.
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email
        })
      };
  
      try {
        // Execute the fetch call with the defined options.
        // Await the response from the server before moving on.
        const response = await fetch(apiUrl, requestOptions);
      
        // Convert the response payload into JSON.
        // Await the completion of the JSON parsing.
        const data = await response.json();
      
        if (response.ok) {
          // The request was successful, process the response data as needed.
          console.log(data);
          alert(data.message || 'Signed up successfully!');
        } else {
          // The request was completed but the server responded with an error status.
          // Alert the user with the message returned from the server.
          alert(data.message || 'An error occurred during sign up.');
        }
      } catch (error) {
        // The fetch call failed due to a network error or some other issue.
        // Log the error to the console and show a user-friendly message.
        console.error('There was an error!', error);
        alert('An unexpected error occurred. Please try again later.');
      }
    
    // console.log(email, username, password, confirmPassword,4);
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };
  const togglePopup = () => {
    setIsTermsVisible(!isTermsVisible);
  };

  return (
    <div className = "root">
      <div className='header'>
        
      </div>
    <div className="signup-form-container">
      <div className="signup-form-header">
      <Link to="/login" className="back-arrow" style={{ textDecoration: 'none', color: 'inherit' }}>←</Link>
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
        <button onClick = {togglePopup}>terms and agreement</button>
      </div>
      {isTermsVisible && (
        <div className="termsPopup">
          <div className="termsContent">
            
            <p>Terms and conditions go here. Include all relevant information and clauses that users must agree to before proceeding.</p>
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
      
    </div>
    <div className="login-redirect">
        Already have an account?&nbsp;  <a href="/login">Click here to log in</a>
      </div>
    </div>
  );
}
export default SignUpForm;