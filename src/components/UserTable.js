import React from 'react';
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

const MAX_EXPAND_TABLE_HEIGHT = 200;
const EXPAND_ROW_HEIGHT = 60;

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.selectedUserInformation = React.createRef();
    this._table = React.createRef();
    this.userTableSize = 0;
    this.expandTableSize = 0;
    this.state = {
      selectedUser: null,
      deletePopup: false,
      loading: false,
      message: '',
      expandedUser: null, //username of the PI whose row was clicked
      expandedUserChildren: [], //list of users added by this PI
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

          {this.state.expandedUserChildren.length == 0 ?
            <div style={{ padding: "10px", fontStyle: "italic" }}>
              This PI has not added any users yet.
            </div>
          :
            <Table // users added by this PI
              width={1300} // width of the first 6 columns of main table
              height={this.expandTableSize}
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
          }
        </div>
      );
    }
  };

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
  }

  getRowHeight = (params) => {
    const isExpanded = this.props.data[params.index].username === this.state.expandedUser;
    return ROW_HEIGHT + (isExpanded ? this.expandTableSize : 0);
  }

  render() {
    const { data, allDataSets } = this.props;
    this.userTableSize = Math.min((data.length + 1) * ROW_HEIGHT, MAX_TABLE_HEIGHT);
    this.expandTableSize = this.state.expandedUser ? Math.min(Math.max(this.state.expandedUserChildren.length, 1) * EXPAND_ROW_HEIGHT, MAX_EXPAND_TABLE_HEIGHT) : 0;
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
                  height={this.userTableSize + this.expandTableSize}
                  headerHeight={ROW_HEIGHT}
                  rowHeight={this.getRowHeight}
                  rowCount={data.length}
                  rowGetter={({ index }) => data[index]}
                  // only DACs can expand the user rows:
                  onRowClick={this.props.whoAmI.iam === 'DAC' ? this.toggleRow : null}
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
