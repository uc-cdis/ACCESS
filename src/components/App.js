import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from '@gen3/ui-component/dist/components/Header';
import { Provider } from 'react-redux'
import configureStore from '../store';
import ReduxHomepage from './ReduxHomepage';
import ReduxManageUsers from './ReduxManageUsers';
import ReduxLogin from './ReduxLogin';
import './App.css';

class App extends Component {
  render() {
    const store = configureStore();
    return (
      <Provider store={store}>
        <div className='app'>
          <Header title='User Access' />
          <BrowserRouter>
            <Switch>
              <Route
                path='/login'
                component={ReduxLogin}
              />
              <Route
                path='/manage'
                component={ReduxManageUsers}
              />
              <Route
                path='/'
                component={ReduxHomepage}
              />
            </Switch>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
