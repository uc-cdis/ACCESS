import { connect } from 'react-redux';
import { fetchUserInfo, logout } from '../actions/userActions';
import ManageUsers from './ManageUsers';

const mapStateToProps = state => {
  return ({
    user: state.user.user,
    token: state.user.token,
    whoAmI: state.user.whoAmI,
  });
}

const mapDispatchToProps = dispatch => ({
  fetchUserInfo: (token) => dispatch(fetchUserInfo(token)),
  logout: () => dispatch(logout()),
});

const ReduxManageUsers = connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
export default ReduxManageUsers;
