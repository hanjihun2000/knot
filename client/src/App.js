import './App.css';
import SignUpForm from './components/SignUpForm';
import LogInForm from './components/LogInForm';
import { BrowserRouter as Router,Route,Switch } from 'react-router-dom';
import MainPageEdit  from './components/UserSettings/MainPageEdit';
import MainPagePrivacy from './components/UserSettings/MainPagePrivacy';
import ProtectedRoute from './components/ProtectedRoute';
import mainPagePost from './components/mainPagePost';

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path = '/'>
            <SignUpForm/>
            </Route>
            <Route path = '/login'>
            <LogInForm />
            </Route>
            <Route exact path = '/home'>
              <MainPageEdit />
            </Route>
            <Route exact path = '/privacy-settings'>
              <MainPagePrivacy/>
            </Route>
            <Route exact path= "/po">
              <mainPagePost/>
              </Route>
            
        </Switch>
      </Router>
  );
}

export default App;
