import { connect } from 'react-redux';
import Homepage from './Homepage';

const mapStateToProps = state => {
  return ({
    user: state.user.user,
    token: state.user.token,
  });
}

const mapDispatchToProps = dispatch => ({ });

const ReduxHomepage= connect(mapStateToProps, mapDispatchToProps)(Homepage);
export default ReduxHomepage;
