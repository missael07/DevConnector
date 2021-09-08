import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profileForm/CreateProfile';
import EditProfile from './components/profileForm/editProfile';
//Reduxx
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import PrivatedRoute from './components/routing/PrivatedRoute';
import AddExperience from './components/profileForm/AddExperience';
import AddEducation from './components/profileForm/AddEducation';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);


  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar></Navbar>
          <Route exact path='/' component={Landing}></Route>
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} ></Route>
              <Route exact path='/login' component={Login}></Route>
              <PrivatedRoute exact path='/dashboard' component={Dashboard}></PrivatedRoute>
              <PrivatedRoute exact path='/createProfile' component={CreateProfile}></PrivatedRoute>
              <PrivatedRoute exact path='/editProfile' component={EditProfile}></PrivatedRoute>
              <PrivatedRoute exact path='/addExperience' component={AddExperience}></PrivatedRoute>
              <PrivatedRoute exact path='/addEducation' component={AddEducation}></PrivatedRoute>

            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
}


export default App;
