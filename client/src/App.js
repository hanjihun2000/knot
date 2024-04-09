import './App.css';
import React from 'react';
import SignUpForm from './components/SignUpForm';
import LogInForm from './components/LogInForm';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SingPage from './components/homepagecomp/singPage';
import SettingPageEdit from './components/UserSettings/SettingPageEdit';
import SettingPagePrivacy from './components/UserSettings/SettingPagePrivacy';
import ProtectedRoute from './components/ProtectedRoute';
import SettingPageThemes from './components/UserSettings/SettingPageThemes';
import { SideBarProvider } from './components/SidebarComp/SideBarContext'; // Ensure the path is correct
import { UserProvider } from './userContext'; // Adjust the import path as necessary
import MainPagePost from './components/UserSettings/MainPagePost';
import NotificationPage from './components/notificationPage';
import singlePageFeed from './components/singlePageFeed';


import MainPageHomePage from './components/UserSettings/MainPageHomePage'; // Adjust your
import UserProfile from './components/UserSettings/UserProfile';
import SearchPage from './components/UserSettings/SearchPage';

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
            <Route path='/search'>
              <SearchPage />
            </Route>
            <Route exact path='/userprofile'>
              <UserProfile/>
            </Route>
            <Route exact path="/posts/:postId" component={SingPage} />
            <ProtectedRoute
              exact
              path='/home'
              component={MainPageHomePage}
              auth={isAuthenticated}
            />
            <ProtectedRoute
              exact
              path='/create-post'
              component={MainPagePost}
              auth={isAuthenticated}
            />
            <ProtectedRoute  
            exact path='/settings/profile-edit'
            component={SettingPageEdit}
            auth={isAuthenticated}
            />
           
            <ProtectedRoute
              exact
              path='/settings/privacy-settings'
              component={SettingPagePrivacy}
              auth={isAuthenticated}
            />
            <ProtectedRoute
              exact
              path='/settings/theme-settings'
              component={SettingPageThemes}
              auth={isAuthenticated}
            />
            <ProtectedRoute
              exact
              path='/profile/:username'
              component={UserProfile}
              auth={isAuthenticated}
            />
            <ProtectedRoute
              exact
              path='/notification'
              component={NotificationPage}
              auth={isAuthenticated}
            />
            <ProtectedRoute
              exact
              path='/post'
              component={singlePageFeed}
              auth={isAuthenticated}
            />
          </Switch>
        </SideBarProvider>
      </UserProvider>
    </Router>
  );

}

export default App;
