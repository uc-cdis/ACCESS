import React from 'react';
import Button from '@gen3/ui-component/dist/components/Button';
import UserInformation from './UserInformation';
import DatasetInformation from './DatasetInformation';
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
      allDataSets: [],
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

  updateTable = async () => {
    await getUsers(this.props.token).then(usersResults => {
      this.setState({ users: usersResults });
    });
    await getDatasets(this.props.token).then(datasetResults => {
      this.setState({allDataSets: datasetResults });
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
          this.props.user && (
            <Button
              onClick={() => this.props.logout() }
              buttonType='primary'
              label={'Log out from '.concat(this.props.user.name)}
              className='manage-users__logout-button'
            />
          )
        }
        {
          this.props.user && (
            <div className='manage-users'>
              <div className='manage-users__tab-bar'>
                <div
                  tab={0}
                  className={'manage-users__tab'.concat(this.state.selectedTab === 0 ? ' manage-users__tab--selected' : '' )}
                  onClick={() => this.selectTab(0)}
                >
                  Manage Current Users
                </div>
                <div
                  tab={1}
                  className={'manage-users__tab'.concat(this.state.selectedTab === 1 ? ' manage-users__tab--selected' : '' )}
                  onClick={() => this.selectTab(1)}
                >
                  Add a New User
                </div>
                {
                  false && this.props.whoAmI.iam === 'DAC' && ( // disabled
                    <div
                      tab={1}
                      className={'manage-users__tab'.concat(this.state.selectedTab === 2 ? ' manage-users__tab--selected' : '' )}
                      onClick={() => this.selectTab(2)}
                    >
                      Add a New Dataset
                    </div>
                  )
                }
              </div>
              <div className='manage-users__content'>
                {
                  this.state.selectedTab === 0 ? (
                    <UserTable data={this.state.users} allDataSets={this.state.allDataSets} updateTable={this.updateTable} {...this.props} />
                  ): this.state.selectedTab === 1 ? (
                    <UserInformation allDataSets={this.state.allDataSets} updateUsers={this.updateTable} {...this.props} />
                  ): (
                    <DatasetInformation updateDatasets={this.updateTable} {...this.props} />
                  )
                }
              </div>
            </div>
          )
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
