import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from '@gen3/ui-component/dist/components/Header';
import { handleLoginCompletion } from '../api/login';
import gen3Logo from '../images/gen3.png';
import Homepage from './Homepage';
import ManageUsers from './ManageUsers';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className='app'>
        <Header title='STAGE Access' logoSrc={gen3Logo} />
        <BrowserRouter>
          <Switch>
            <Route
              path='/login'
              render={() => {
                handleLoginCompletion();
                return (null);
              }}
            />
            <Route
              path='/manage'
              component={ManageUsers}
            />
            <Route
              path='/'
              component={Homepage}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
