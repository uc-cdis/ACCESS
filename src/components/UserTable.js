import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import { AutoSizer, Column, Table, defaultTableRowRenderer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import Popup from './Popup';
import Spinner from './Spinner';
import UserInformation from './UserInformation';
import { getUsersForPI, deleteUser, editUser } from '../api/users';
import './UserTable.css';

const MAX_TABLE_HEIGHT = 800;
const ROW_HEIGHT = 120;

const MAX_EXPAND_TABLE_HEIGHT = 400;
const EXPAND_ROW_HEIGHT = 60;

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.selectedUserInformation = React.createRef();
    this._table = React.createRef(); // TODO remove?
    this.state = {
      selectedUser: null,
      deletePopup: false,
      loading: false,
      message: '',
      expandedUser: null,
      expandedUserChildren: [],
    };
  }

  // edit/delete pop up
  openPopup = (selectedUser, deletePopup) => {
    this.setState({ selectedUser, deletePopup });
  }

  closePopup = () => {
    this.setState({ selectedUser: null, deletePopup: false }, () => this.props.updateTable());
  }

  // edit/delete result pop up
  showResultPopup = (message, isDelete) => {
    this.setState({ message, deletePopup: isDelete });
  }

  closeResultPopup = () => {
    this.setState({ message: '', deletePopup: false });
  }

  deleteUser = () => {
    this.setState({ deletePopup: false, loading: true }, () => {
      deleteUser(this.state.selectedUser.username, this.props.token)
        .then(async res => {
          this.showResultPopup(res.message ? `Error: ${res.message}` : `Successfully deleted user ${this.state.selectedUser.name} (${this.state.selectedUser.username}).`, true);
          this.props.updateTable();
        })
        .then(() => this.setState({ selectedUser: null, loading: false }));
    });
  }

  editUser = () => {
    let newInformation = this.selectedUserInformation.current.state;
    let validationError = this.selectedUserInformation.current.checkFieldsAreValid();
    if (validationError) {
      this.showResultPopup(`Error: ${validationError}`, false);
      this.closePopup();
    }
    else {
      this.setState({ loading: true }, () => {
        editUser(newInformation, this.props.token)
        .then(async res => {
          this.showResultPopup(res.message ? `Error: ${res.message}` : `Successfully updated user ${this.state.selectedUser.name} (${this.state.selectedUser.username}).`, false);
          this.props.updateTable();
        })
        .then(() => this.setState({ selectedUser: null, loading: false }));
      });
    }
  }

  userRowGetter = ({ index }) => this.props.data[index % this.props.data.length];

/**
 If the current user is a PI: renders the user row (cannot expand).
 If the current user is a DAC:
 - If the PI user row is not expanded, renders the PI user row.
 - If it is expanded, renders the PI user row and a table of the users
 added by this PI.
 */
  userRowRenderer = (params) => {
    const { style, key, rowData } = params;
    if (rowData.username != this.state.expandedUser) {
      return defaultTableRowRenderer(params);
    }
    else {
      return (
        <div
          style={{ ...style, display: "flex", flexDirection: "column" }}
          key={key}
        >
          {defaultTableRowRenderer({ // PI user row
            ...params,
            style: { height: ROW_HEIGHT }
          })}

          <Table // users added by this PI
            width={1300} // width of the first 6 columns of main table
            height={Math.min(this.state.expandedUserChildren.length * EXPAND_ROW_HEIGHT, MAX_EXPAND_TABLE_HEIGHT - ROW_HEIGHT)}
            disableHeader={true}
            rowHeight={EXPAND_ROW_HEIGHT}
            rowCount={this.state.expandedUserChildren.length}
            rowGetter={({ index }) => this.state.expandedUserChildren[index]}
            rowStyle={{backgroundColor: "lightgray"}}
          >
            <Column
              label='Username'
              dataKey='username'
              width={200}
            />
            <Column
              width={300}
              label='Name'
              dataKey='name'
            />
            <Column
              label='Organization'
              dataKey='organization'
              width={200}
            />
            <Column
              label='Contact Email'
              dataKey='contact_email'
              width={200}
            />
            <Column
              label='eRA Commons'
              dataKey='eracommons'
              width={200}
            />
            <Column
              label='Google Email'
              dataKey='google_email'
              width={200}
            />
          </Table>
        </div>
      );
    }
  };

  getUsersChildren = (users) => {
    var allUsers = [];
    users.map(async pi => {
      allUsers.push(pi);
      await getUsersForPI(this.props.token, pi.username).then(children => allUsers.push(children));
    });
    return allUsers;
    // getUsersForPI().then(usersResults => this.setState({ users: usersResults }));
  }

  toggleRow = async (e) => {
    const pi = e.rowData.username;
    if (this.state.expandedUser === pi) {
      this.setState({expandedUser: null, expandedUserChildren: []})
    }
    else {
      await getUsersForPI(this.props.token, pi.username).then(res => {
        this.setState({
          expandedUser: pi,
          expandedUserChildren: res // TODO: cache this
        })
      })
    }
    this._table.current.recomputeRowHeights();
    // this._table.current.forceUpdateGrid();
  }

  test = (data, index) => {
    const username = data[index].username;
    if (this.state.expandedUser == data[index].parent) {

    }
    return data[index];
    // this.setState({expandedUser: row.username});
  }

  getRowHeight = (params) => {
    if (this.props.data[params.index].username === this.state.expandedUser) {
      return Math.min(ROW_HEIGHT + this.state.expandedUserChildren.length * EXPAND_ROW_HEIGHT, MAX_EXPAND_TABLE_HEIGHT);
    }
    return ROW_HEIGHT;
  }

  render() {
    // var { data, allDataSets } = this.props;
    // data = this.getUsersChildren(data);
    const { data, allDataSets } = this.props;
    const tableSize = (data.length + 1) * ROW_HEIGHT;
    console.log(tableSize < MAX_TABLE_HEIGHT ? tableSize : MAX_TABLE_HEIGHT)

    return (
      <div className='user-table'>
        {
          this.state.loading ?
            <Spinner />
            :
            <AutoSizer disableHeight>
              {({ width }) => (
                <Table
                  ref={this._table}
                  width={width}
                  height={Math.max(Math.min(tableSize, MAX_TABLE_HEIGHT), ROW_HEIGHT + this.state.expandedUserChildren.length * EXPAND_ROW_HEIGHT)}
                  headerHeight={ROW_HEIGHT}
                  rowHeight={this.getRowHeight} //{ROW_HEIGHT}
                  rowCount={data.length}
                  rowGetter={this.userRowGetter} //{({ index }) => data[index]}
                  // rowGetter={({ index }) => this.test(data, index)}
                  // rowRenderer={({ index }) => this.userRowRenderer(data[index])}
                  onRowClick={this.toggleRow}
                  rowRenderer={this.userRowRenderer}
                >
                  <Column
                    label='Username'
                    dataKey='username'
                    width={200}
                  />
                  <Column
                    width={300}
                    label='Name'
                    dataKey='name'
                  />
                  <Column
                    label='Organization'
                    dataKey='organization'
                    width={200}
                  />
                  <Column
                    label='Contact Email'
                    dataKey='contact_email'
                    width={200}
                  />
                  <Column
                    label='eRA Commons'
                    dataKey='eracommons'
                    width={200}
                  />
                  <Column
                    label='Google Email'
                    dataKey='google_email'
                    width={200}
                  />
                  <Column
                    label='Expiration'
                    dataKey='expiration'
                    width={200}
                  />
                  <Column
                    label='Actions'
                    dataKey='actions'
                    width={200}
                    cellRenderer={({ rowIndex }) => (
                      // data[rowIndex].username == 'pribeyre63@gmail.com' ?
                      <React.Fragment>
                        <Button
                          className='user-table__button'
                          onClick={() => this.openPopup(data[rowIndex], false)}
                          buttonType='primary'
                          label='Edit'
                        />
                        <Button
                          className='user-table__button'
                          onClick={() => this.openPopup(data[rowIndex], true)}
                          buttonType='primary'
                          label='Delete'
                        />
                      </React.Fragment>
                      // : null
                    )}
                  />
                </Table>
              )}
            </AutoSizer>
        }
        {
          this.state.selectedUser && this.state.deletePopup && (
            <Popup
              title='Delete User'
              message={
                `Are you sure you want to delete ${this.state.selectedUser.name} at ${this.state.selectedUser.organization}?
                This action cannot be undone.`
              }
              leftButtons={[
                {
                  caption: 'Delete',
                  fn: this.deleteUser,
                },
              ]}
              rightButtons={[
                {
                  caption: 'Cancel',
                  fn: this.closePopup,
                },
              ]}
            />
          )
        }
        {
          this.state.selectedUser && !this.state.deletePopup && !this.state.loading && (
            <Popup
              title='Edit User'
              message=''
              leftButtons={[
                {
                  caption: 'Save',
                  fn: this.editUser,
                },
              ]}
              rightButtons={[
                {
                  caption: 'Close',
                  fn: this.closePopup,
                },
              ]}
            >
              <UserInformation ref={this.selectedUserInformation} selectedUser={this.state.selectedUser} allDataSets={allDataSets} updateUsers={this.props.updateTable} whoAmI={this.props.whoAmI}/>
            </Popup>
          )
        }
        {
          this.state.message && (
            <Popup
              title={this.state.deletePopup ? 'Delete User' : 'Edit User'}
              message={this.state.message}
              rightButtons={[
                {
                  caption: 'Close',
                  fn: this.closeResultPopup,
                },
              ]}
            />
          )
        }
      </div>
    )
  }
}

UserTable.propTypes = {
  data: PropTypes.array.isRequired,
  updateTable: PropTypes.func.isRequired,
  token: PropTypes.object,
};

UserTable.defaultProps = {
  token: null,
};

export default UserTable;
