import React, { Component } from 'react';
import Button from '@gen3/ui-component/dist/components/Button';
import { loginRedirect, userIsLoggedIn } from '../api/login';
import './Homepage.css';

class Homepage extends Component {
  componentDidMount() {
    userIsLoggedIn(this.props.token).then((loggedIn) => {
      if (loggedIn) {
        this.props.history.push('/manage');
      }
    }).catch(error => error);
  }

  render() {
    return (
      <React.Fragment>
        {
          !!!this.props.token && (
            <div className='homepage__login'>
              <Button
                onClick={() => loginRedirect(window.location.href)}
                buttonType={'primary'}
                label={'Login'}
              />
            </div>
          )
        }
      </React.Fragment>
    );
  }
}

export default Homepage;
