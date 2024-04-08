import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  // Check for an authentication token in localStorage
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          // Redirect to the login page if not authenticated
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
