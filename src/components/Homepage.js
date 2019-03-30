import React, { Component } from 'react';
import Button from '@gen3/ui-component/dist/components/Button';
import { loginRedirect, logout, userIsLoggedIn } from '../api/login';
import './Homepage.css';

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: null,
    }
  }

  componentDidMount() {
    userIsLoggedIn().then((loggedIn) => {
      if (loggedIn) {
        this.props.history.push('/manage');
      } else {
        this.setState({ loggedIn: false });
      }
    });
  }

  logout = () => {
    logout();
    this.forceUpdate();
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.loggedIn === false ?
            <div className='homepage__login'>
              <Button
                onClick={() => loginRedirect(window.location.href)}
                buttonType={'primary'}
                label={'Login'}
              />
            </div>
          : null
        }
      </React.Fragment>
    );
  }
}

export default Homepage;
