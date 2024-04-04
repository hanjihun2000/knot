import './App.css';
import SignUpForm from './components/SignUpForm';
import LogInForm from './components/LogInForm';
import { BrowserRouter as Router,Route,Switch } from 'react-router-dom';
import MainPage  from './components/MainPage';
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
              <MainPage />
            </Route>
        </Switch>
      </Router>
  );
}

export default App;
