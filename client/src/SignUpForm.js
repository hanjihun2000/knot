import React, { useState } from "react";
import "./SignUpForm.css"; // Make sure to create a corresponding CSS file
import toggleVisi from "./OIP.jpg";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const handleSignUp = (event) => {
    console.log(event);
    // Check if the passwords entered in both password fields match.
    // Alert the user and prevent form submission if they do not.
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return; // Stop the function if the passwords don't match.
    }
    // Define the API endpoint where the form data should be sent.
    const apiUrl = "http://localhost:3000/api/userapi/register";

    // Set up the request options for the fetch call.
    // This includes the method (POST), headers, and the body,
    // which contains the JSON stringified form data.
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
      }),
    };
    try {
      // Execute the fetch call with the defined options.
      // Await the response from the server before moving on.
      const response = fetch(apiUrl, requestOptions);

      // Convert the response payload into JSON.
      // Await the completion of the JSON parsing.
      const data = response.json();

      if (response.ok) {
        // The request was successful, process the response data as needed.
        console.log(data);
        alert(data.message, "Signed up successfully!");

        // window.location.href = '/login';
      } else {
        // The request was completed but the server responded with an error status.
        // Alert the user with the message returned from the server.
        alert(data.message, "An error occurred during sign up.");
      }
    } catch (error) {
      // The fetch call failed due to a network error or some other issue.
      // Log the error to the console and show a user-friendly message.
      console.error("There was an error!", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  return (
    <div className="root">
      <div className="signup-form-container">
        <div className="signup-form-header">
          <span className="back-arrow">←</span>
          <h1>Knot</h1>
          <p>Weaving Stories, Building Communities</p>
        </div>
        <form className="signup-form" onSubmit={handleSignUp}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <div className="password-container">
            <input
              type={passwordShown ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <img
              className="toggle-vis"
              src={toggleVisi}
              alt="Show/Hide"
              onClick={togglePasswordVisibility}
            />
          </div>
          <div className="password-container">
            <input
              type={confirmPasswordShown ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <img
              className="toggle-vis"
              src={toggleVisi}
              alt="Show/Hide"
              onClick={toggleConfirmPasswordVisibility}
            />
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
