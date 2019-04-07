import React from 'react';
import PropTypes from 'prop-types';
import querystring from 'querystring';
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
    const user = this.props.fetchUserInfo(token)
  }

  handleLoginCompletion = () => {
    const fragments = window.location.href.split('#');
    if (fragments.length === 1) {
      return
    }
    const responseValues = fragments[1];
    const tokenParams = querystring.parse(responseValues);
    if (tokenParams && !tokenParams.error) {
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
