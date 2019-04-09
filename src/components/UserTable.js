import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import Popup from './Popup';
import Spinner from './Spinner';
import UserInformation from './UserInformation';
import { deleteUser, editUser } from '../api/users';
import './UserTable.css';

const ROW_HEIGHT = 120;

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.selectedUserInformation = React.createRef();
    this.state = {
      selectedUser: null,
      deletePopup: false,
      loading: false,
    };
  }

  openPopup = (selectedUser, deletePopup) => {
    this.setState({ selectedUser, deletePopup });
  }

  closePopup = () => {
    this.setState({ selectedUser: null, deletePopup: false }, () => this.props.updateTable());
  }

  deleteUser = () => {
    this.setState({ deletePopup: false, loading: true }, () => {
      deleteUser(this.state.selectedUser.username, this.props.token)
        .then(res => this.props.updateTable())
        .then(() => this.setState({ selectedUser: null, loading: false }));
    });
  }

  editUser = () => {
    let newInformation = this.selectedUserInformation.current.state;
    this.setState({ loading: true }, () => {
      editUser(newInformation, this.props.token)
        .then(res => this.props.updateTable())
        .then(() => this.setState({ selectedUser: null, loading: false }));
    });
  }

  render() {
    const { data, allDataSets } = this.props;
    const tableSize = (data.length + 1) * ROW_HEIGHT;
    return (
      <div className='user-table'>
        {
          this.state.loading ?
            <Spinner />
            :
            <AutoSizer disableHeight>
              {({ width }) => (
                <Table
                  width={width}
                  height={tableSize < 800 ? tableSize : 800}
                  headerHeight={ROW_HEIGHT}
                  rowHeight={ROW_HEIGHT}
                  rowCount={data.length}
                  rowGetter={({ index }) => data[index]}
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
          this.state.selectedUser && this.state.deletePopup ? (
            <Popup
              title='Delete User'
              message={
                `Are you sure you want to delete ${this.state.selectedUser.name} at ${this.state.selectedUser.organization}?
                This action can't be undone.`
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
          ) : null
        }
        {
          this.state.selectedUser && !this.state.deletePopup && !this.state.loading ? (
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
              <UserInformation ref={this.selectedUserInformation} selectedUser={this.state.selectedUser} allDataSets={allDataSets} updateUsers={this.props.updateTable}/>
            </Popup>
          ) : null
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
