import './App.css';
import React from 'react';
import SignUpForm from './components/SignUpForm';
import LogInForm from './components/LogInForm';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPageEdit from './components/UserSettings/MainPageEdit';
import MainPagePrivacy from './components/UserSettings/MainPagePrivacy';
import ProtectedRoute from './components/ProtectedRoute';
import MainPageThemes from './components/UserSettings/MainPageThemes';
import { SideBarProvider } from './components/SidebarComp/SideBarContext'; // Ensure the path is correct
import { UserProvider } from './userContext'; // Adjust the import path as necessary

function App() {
  // Check if the user is authenticated by verifying the token's presence
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <UserProvider> {/* Wrap the entire application or the relevant part with UserProvider */}
        <SideBarProvider>
          <Switch>
            <Route exact path='/'>
              <SignUpForm />
            </Route>
            <Route path='/login'>
              <LogInForm />
            </Route>
            
            <ProtectedRoute
              exact
              path='/home'
              component={MainPageEdit}
              auth={isAuthenticated}
            />
            <ProtectedRoute
              exact
              path='/privacy-settings'
              component={MainPagePrivacy}
              auth={isAuthenticated}
            />
            <ProtectedRoute
              exact
              path='/theme-settings'
              component={MainPageThemes}
              auth={isAuthenticated}
            />
          </Switch>
        </SideBarProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
