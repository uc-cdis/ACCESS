import React from 'react';
import UserInformation from './UserInformation';
import UserTable from './UserTable';
import { userIsLoggedIn } from '../api/login';
import './ManageUsers.css';

const users = [
  {
    id: 0,
    firstName: 'Abby',
    lastName: 'George',
    organization: 'UChicago',
    eRA: 'abbygeorge',
    ORCID: 'abbygeorge',
    PI: 'Robert Grossman',
    accessDate: '3/20/2019',
    accessExp: '3/21/2021',
  },
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    organization: 'Broad',
    eRA: 'johnsmith',
    ORCID: 'johnsmith',
    PI: 'Anthony Philippakis',
    accessDate: '1/23/2019',
    accessExp: '5/23/2021',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    organization: 'UCSC',
    eRA: 'janedoe',
    ORCID: 'janedoe',
    PI: 'Benedict Paten',
    accessDate: '12/03/2018',
    accessExp: '12/03/2021',
  },
];

class ManageUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      loggedIn: null,
    }
  }

  componentDidMount() {
    userIsLoggedIn().then((loggedIn) => {
      if (!loggedIn) {
        this.props.history.push('/');
      } else {
        this.setState({ loggedIn: true });
      }
    });
  }

  selectTab = tab => {
    this.setState({ selectedTab: tab });
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.loggedIn ?
            <div className='manage-users'>
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
                    <UserInformation />
                  ): (
                    <UserTable data={users} />
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
