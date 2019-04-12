import { connect } from 'react-redux';
import { login, fetchUserInfo } from '../actions/userActions';
import Login from './Login';

const mapStateToProps = state => {
  console.log('state', state)
  return ({
    token: state.user.token,
    user: state.user.user,
    whoAmI: state.user.whoAmI,
  });
}

const mapDispatchToProps = dispatch => ({
  fetchUserInfo: (token) => dispatch(fetchUserInfo(token)),
  login: (token) => dispatch(login(token))
});

const ReduxLogin = connect(mapStateToProps, mapDispatchToProps)(Login);
export default ReduxLogin;
