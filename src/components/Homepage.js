import React, { Component } from 'react';
import Button from '@gen3/ui-component/dist/components/Button';
import { loginRedirect, userIsLoggedIn, fetchLoginOptions } from '../api/login';
import './Homepage.css';

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginOptions: [],
    };
  }

  componentDidMount() {
    userIsLoggedIn(this.props.token).then((loggedIn) => {
      if (loggedIn) {
        this.props.history.push('/manage');
      } else {
        fetchLoginOptions().then((options) => {
          console.log(options)
          if (options && options.providers) {
            this.setState({ loginOptions: options.providers });
          }
        }).catch(error => error);
      }
    }).catch(error => error);
  }

  render() {
    return (
      <React.Fragment>
        {
          !!!this.props.token && (
            <div className='homepage__login'>
              {
                this.state.loginOptions.map((option, i) =>
                  <Button
                    className='homepage__login-button'
                    key={i}
                    onClick={() => loginRedirect(option.id, window.location.href)}
                    buttonType={'primary'}
                    label={option.name}
                  />
                )
              }
            </div>
          )
        }
      </React.Fragment>
    );
  }
}

export default Homepage;
