import React from 'react';
import Button from '@gen3/ui-component/dist/components/Button';
import UserInformation from './UserInformation';
import UserTable from './UserTable';
import { userIsLoggedIn } from '../api/login';
import { getUsers } from '../api/users';
import { getDatasets } from '../api/datasets';
import './ManageUsers.css';

class ManageUsers extends React.Component {
  constructor(props) {
    super(props);
    this.updateUsers = this.updateUsers.bind(this);
    this.state = {
      selectedTab: 0,
      users: [],
      dataSets: [],
    }
  }

  componentDidMount() {
    userIsLoggedIn(this.props.token).then((loggedIn) => {
      if (!loggedIn) {
        this.props.history.push('/');
      } else {
        this.updateTable();
      }
    }).catch(error => error);
  }

  componentWillReceiveProps(nextProps) {
    if (!!!nextProps.user) {
      this.props.history.push('/');
    }
  }

  updateTable = () => {
    console.log('updating users...')
    getUsers(this.props.token).then(usersResults => {
      console.log('users', usersResults)
      this.setState({ users: usersResults });
    });
    getDatasets(this.props.token).then(datasetResults => {
      console.log('datasets', datasetResults)
      this.setState({dataSets: datasetResults })
    });
  }

  updateUsers() {
    getUsers().then(usersResults => this.setState({ users: usersResults }));
  }

  selectTab = tab => {
    this.setState({ selectedTab: tab });
  }

  render() {
    return (
      <React.Fragment>
        {
          this.props.user ?
            <div className='manage-users'>
              <Button
                onClick={() => this.props.logout() }
                buttonType='primary'
                label={'Log out from '.concat(this.props.user.name)}
              />
              <div className='manage-users__tab-bar'>
                <div
                  tab={0}
                  className={'manage-users__tab'.concat(this.state.selectedTab === 0 ? ' manage-users__tab--selected' : '' )}
                  onClick={() => this.selectTab(0)}
                >
                  Add a New User
                </div>
                <div
                  tab={1}
                  className={'manage-users__tab'.concat(this.state.selectedTab === 1 ? ' manage-users__tab--selected' : '' )}
                  onClick={() => this.selectTab(1)}
                >
                  Manage Current Users
                </div>
              </div>
              <div className='manage-users__content'>
                {
                  this.state.selectedTab === 0 ? (
                    <UserInformation dataSets={this.state.dataSets} updateUsers={this.updateTable} {...this.props} />
                  ): (
                    <UserTable data={this.state.users} dataSets={this.state.dataSets} updateTable={this.updateTable} {...this.props} />
                  )
                }
              </div>
            </div>
          : null
        }
      </React.Fragment>
    )
  }
}

export default ManageUsers;

/*
// <Popup
//   message={'Your session has expired or you are logged out. Please log in to continue.'}
//   rightButtons={[
//     {
//       caption: 'go to login',
//       fn: () => { },
//     },
//   ]}
// />
*/
