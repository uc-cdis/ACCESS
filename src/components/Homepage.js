import React, { Component } from 'react';
import CommonsLogin from '@gen3/ui-component/dist/components/CommonsLogin';
import { getToken, loginRedirect, handleLoginCompletion, logout } from '../api/login';
import { commonsList } from '../config';
import dcpLogo from '../images/dcp-logo.png';
import './Homepage.css';

class Homepage extends Component {
  logout = (commons) => {
    logout(commons);
    this.forceUpdate();
  }

  render() {
    handleLoginCompletion();
    const images = { kfLogo, dcpLogo };
    return (
      <div className='homepage__login'>
        {
          commonsList.map((commons, i) => {
            const connected = getToken(commons.tokenPath);
            return (
              <div className='homepage__login-button' key={i}>
                <CommonsLogin
                  logoSrc={images[`${commons.tokenPath}Logo`]}
                  title={commons.name}
                  buttonTitle={connected ? 'Disconnect' : 'Connect'}
                  onButtonClick={connected ? () => this.logout(commons) : () => loginRedirect(commons, window.location.href)}
                  buttonEnabled={true}
                  buttonType={connected ? 'primary' : 'secondary'}
                  message={connected ? 'Connected!' : null}
                />
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default Homepage;
