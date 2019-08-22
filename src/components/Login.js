import React from 'react';
import PropTypes from 'prop-types';
import querystring from 'querystring';
import jwtDecode from 'jwt-decode';
import Spinner from './Spinner';

class Login extends React.Component {
  componentDidMount() {
    this.handleLoginCompletion();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.token !== nextProps.token && nextProps.token !== null &&
      this.props.user !== nextProps.user && nextProps.user!== null) {
      this.props.history.push('/manage');
    }
  }

  fetchUser = async (token) => {
    this.props.fetchUserInfo(token)
  }

  handleLoginCompletion = () => {
    const fragments = window.location.href.split('#');
    if (fragments.length === 1) {
      return
    }
    const responseValues = fragments[1];
    const tokenParams = querystring.parse(responseValues);
    if (tokenParams && !tokenParams.error) {
      const decodedToken = jwtDecode(tokenParams.id_token);
      if (decodedToken.nonce && decodedToken.nonce !== window.sessionStorage.getItem('nonce')) {
        console.log('Error: nonce does not match');
        window.location = origin;
        return;
      }
      this.props.login(tokenParams);
    }
  }

  render() {
    return (
      <Spinner />
    )
  }
}

Login.propTypes = {
  user: PropTypes.object,
  token: PropTypes.object,
  history: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  fetchUserInfo: PropTypes.func.isRequired,
};

Login.defaultProps = {
  user: null,
  token: null,
};

export default Login;
